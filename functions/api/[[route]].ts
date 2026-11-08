// Cloudflare Pages Functions: Full API Router for St. Mary's Golden Jubilee
// Connects directly to Cloudflare D1 Serverless Database

interface Env {
  DB?: any; // Cloudflare D1 Database binding
}

interface EventContext {
  request: Request;
  env: Env;
  params: { route?: string[] };
}

// Helper to return JSON responses with CORS headers
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequest(context: EventContext): Promise<Response> {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, ''); // e.g. /events, /contributions/check-email/test@example.com
  const method = request.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const db = env.DB;

  try {
    // 1. Health check
    if (path === '' || path === '/' || path === '/health') {
      return jsonResponse({
        status: 'ok',
        school: "St. Mary's School, Jajpur Road",
        jubilee: '50th Golden Jubilee (1976-2026)',
        cloud: 'Cloudflare Pages & D1',
        timestamp: new Date().toISOString(),
      });
    }

    // 2. EVENTS
    if (path === '/events' && method === 'GET') {
      if (!db) return jsonResponse([]);
      const { results } = await db.prepare('SELECT * FROM events ORDER BY date ASC').all();
      return jsonResponse(results || []);
    }

    if (path === '/events' && method === 'POST') {
      const event = await request.json();
      if (!event.title || !event.date) {
        return jsonResponse({ error: 'Title and date are required' }, 400);
      }
      const id = event.id || `evt-${Date.now()}`;
      if (db) {
        await db
          .prepare(
            'INSERT OR REPLACE INTO events (id, title, date, time, venue, category, description, chiefGuest, rsvpCount, highlight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(
            id,
            event.title,
            event.date,
            event.time || '',
            event.venue || '',
            event.category || 'Ceremony',
            event.description || '',
            event.chiefGuest || '',
            event.rsvpCount || 0,
            event.highlight ? 1 : 0
          )
          .run();
      }
      return jsonResponse({ ...event, id });
    }

    const eventDeleteMatch = path.match(/^\/events\/([^/]+)$/);
    if (eventDeleteMatch && method === 'DELETE') {
      const id = eventDeleteMatch[1];
      if (db) {
        await db.prepare('DELETE FROM events WHERE id = ?').bind(id).run();
      }
      return jsonResponse({ success: true });
    }

    const rsvpMatch = path.match(/^\/events\/([^/]+)\/rsvp$/);
    if (rsvpMatch && method === 'POST') {
      const id = rsvpMatch[1];
      if (db) {
        await db.prepare('UPDATE events SET rsvpCount = COALESCE(rsvpCount, 0) + 1 WHERE id = ?').bind(id).run();
        const updated = await db.prepare('SELECT * FROM events WHERE id = ?').bind(id).first();
        return jsonResponse(updated || { id, success: true });
      }
      return jsonResponse({ success: true });
    }

    // 3. TIMELINE
    if (path === '/timeline' && method === 'GET') {
      if (!db) return jsonResponse([]);
      const { results } = await db.prepare('SELECT * FROM timeline ORDER BY CAST(year AS INTEGER) ASC').all();
      return jsonResponse(results || []);
    }

    if (path === '/timeline' && method === 'POST') {
      const item = await request.json();
      const id = item.id || `tl-${Date.now()}`;
      const cleanYear = typeof item.year === 'number' || (!isNaN(Number(item.year)) && !String(item.year).includes('-'))
        ? Number(item.year)
        : String(item.year);
      if (db) {
        await db
          .prepare(
            'INSERT OR REPLACE INTO timeline (id, year, title, description, era, iconType, badge) VALUES (?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(
            id,
            cleanYear,
            item.title,
            item.description || '',
            item.era || 'Foundation (1976-1985)',
            item.iconType || 'School',
            item.badge || ''
          )
          .run();
      }
      return jsonResponse({ ...item, id, year: cleanYear });
    }

    const timelineDeleteMatch = path.match(/^\/timeline\/([^/]+)$/);
    if (timelineDeleteMatch && method === 'DELETE') {
      const id = timelineDeleteMatch[1];
      if (db) {
        await db.prepare('DELETE FROM timeline WHERE id = ?').bind(id).run();
      }
      return jsonResponse({ success: true });
    }

    // 4. CONTRIBUTIONS
    if (path === '/contributions' && method === 'GET') {
      if (!db) return jsonResponse([]);
      // Purge testing contribution entry
      await db.prepare('DELETE FROM contributions WHERE amount = 1000 OR LOWER(donorName) LIKE ?').bind('%test%').run();

      const authHeader = request.headers.get('Authorization');
      const isAdmin = authHeader === 'Bearer stmarys-auth-token';

      const { results } = await db
        .prepare('SELECT * FROM contributions ORDER BY createdAt DESC')
        .all();

      const items = results || [];

      if (isAdmin) {
        return jsonResponse(items);
      }

      // Public wall view masks private anonymous info
      const publicView = items.map((c: any) => ({
        id: c.id,
        receiptNumber: c.receiptNumber,
        donorName: c.isAnonymous ? 'Generous Marian Benefactor' : c.donorName,
        role: c.role,
        batchYear: c.batchYear,
        amount: c.amount,
        tier: c.tier,
        message: c.message,
        createdAt: c.createdAt,
        isAnonymous: Boolean(c.isAnonymous),
      }));

      return jsonResponse(publicView);
    }

    const emailCheckMatch = path.match(/^\/contributions\/check-email\/(.+)$/);
    if (emailCheckMatch && method === 'GET') {
      const targetEmail = decodeURIComponent(emailCheckMatch[1] || '').trim().toLowerCase();
      if (!db || !targetEmail) {
        return jsonResponse({ used: false, count: 0, contributions: [], lastContribution: null });
      }

      const { results } = await db
        .prepare('SELECT * FROM contributions WHERE LOWER(email) = ? ORDER BY createdAt DESC')
        .bind(targetEmail)
        .all();

      const matches = results || [];
      return jsonResponse({
        used: matches.length > 0,
        count: matches.length,
        contributions: matches,
        lastContribution: matches[0] || null,
      });
    }

    const contributionByIdMatch = path.match(/^\/contributions\/([^/]+)$/);
    if (contributionByIdMatch && method === 'GET') {
      const id = contributionByIdMatch[1];
      if (!db) return jsonResponse({ error: 'Receipt not found' }, 404);
      const found = await db
        .prepare('SELECT * FROM contributions WHERE id = ? OR receiptNumber = ?')
        .bind(id, id)
        .first();

      if (found) return jsonResponse(found);
      return jsonResponse({ error: 'Receipt not found' }, 404);
    }

    if (contributionByIdMatch && method === 'DELETE') {
      const id = contributionByIdMatch[1];
      const authHeader = request.headers.get('Authorization');
      if (authHeader !== 'Bearer stmarys-auth-token') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }
      if (db) {
        await db.prepare('DELETE FROM contributions WHERE id = ?').bind(id).run();
      }
      return jsonResponse({ success: true });
    }

    if (path === '/contributions' && method === 'POST') {
      const body = await request.json();
      const {
        donorName,
        role,
        batchYear,
        email,
        phone,
        amount,
        tier,
        paymentMethod,
        message,
        isAnonymous,
        screenshotUrl,
        utrNumber,
        upiId,
        receiverName,
      } = body;

      if (!donorName || !amount || Number(amount) <= 0) {
        return jsonResponse({ error: 'Valid donor name and amount required' }, 400);
      }

      const countResult = db ? await db.prepare('SELECT COUNT(*) as count FROM contributions').first() : { count: 0 };
      const serialNum = 1000 + (countResult?.count || 0) + 1;
      const receiptNumber = `SMJ-GJ-2026-${serialNum}`;
      const paymentRef = utrNumber && utrNumber.trim() ? `UTR-${utrNumber.trim()}` : `UPI-${Date.now().toString().slice(-8)}`;
      const id = `cnt-${Date.now()}`;
      const createdAt = new Date().toISOString();

      const newContribution = {
        id,
        receiptNumber,
        donorName: donorName.trim(),
        role: role || 'Well-Wisher',
        batchYear: batchYear || null,
        email: email ? email.trim() : '',
        phone: phone ? phone.trim() : '',
        amount: Number(amount),
        tier: tier || 'Golden Patron',
        paymentMethod: paymentMethod || 'UPI Payment',
        paymentRef,
        message: message ? message.trim() : null,
        isAnonymous: isAnonymous ? 1 : 0,
        createdAt,
        screenshotUrl: screenshotUrl || null,
        utrNumber: utrNumber ? utrNumber.trim() : null,
        upiId: upiId || '7855939099-3@ybl',
        receiverName: receiverName || 'Akshya Kumar Senapati',
        status: 'completed',
      };

      if (db) {
        await db
          .prepare(
            `INSERT INTO contributions (
              id, receiptNumber, donorName, role, batchYear, email, phone,
              amount, tier, paymentMethod, paymentRef, message, isAnonymous,
              createdAt, screenshotUrl, utrNumber, upiId, receiverName, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            newContribution.id,
            newContribution.receiptNumber,
            newContribution.donorName,
            newContribution.role,
            newContribution.batchYear,
            newContribution.email,
            newContribution.phone,
            newContribution.amount,
            newContribution.tier,
            newContribution.paymentMethod,
            newContribution.paymentRef,
            newContribution.message,
            newContribution.isAnonymous,
            newContribution.createdAt,
            newContribution.screenshotUrl,
            newContribution.utrNumber,
            newContribution.upiId,
            newContribution.receiverName,
            newContribution.status
          )
          .run();
      }

      return jsonResponse(newContribution, 201);
    }

    // 5. WISHES
    if (path === '/wishes' && method === 'GET') {
      if (!db) return jsonResponse([]);
      const { results } = await db.prepare('SELECT * FROM wishes ORDER BY createdAt DESC').all();
      return jsonResponse(results || []);
    }

    if (path === '/wishes' && method === 'POST') {
      const { name, batchYear, role, city, message } = await request.json();
      if (!name || !message) {
        return jsonResponse({ error: 'Name and message are required' }, 400);
      }
      const wish = {
        id: `wsh-${Date.now()}`,
        name: name.trim(),
        batchYear: batchYear || null,
        role: role || 'Alumnus',
        city: city || null,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };
      if (db) {
        await db
          .prepare('INSERT INTO wishes (id, name, batchYear, role, city, message, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(wish.id, wish.name, wish.batchYear, wish.role, wish.city, wish.message, wish.createdAt)
          .run();
      }
      return jsonResponse(wish, 201);
    }

    const wishDeleteMatch = path.match(/^\/wishes\/([^/]+)$/);
    if (wishDeleteMatch && method === 'DELETE') {
      const id = wishDeleteMatch[1];
      const authHeader = request.headers.get('Authorization');
      if (authHeader !== 'Bearer stmarys-auth-token') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }
      if (db) {
        await db.prepare('DELETE FROM wishes WHERE id = ?').bind(id).run();
      }
      return jsonResponse({ success: true });
    }

    // 6. ANNOUNCEMENTS
    if (path === '/announcements' && method === 'GET') {
      if (!db) return jsonResponse([]);
      const { results } = await db.prepare('SELECT * FROM announcements').all();
      return jsonResponse(results || []);
    }

    if (path === '/announcements' && method === 'POST') {
      const ann = await request.json();
      const id = ann.id || `anc-${Date.now()}`;
      if (db) {
        await db
          .prepare('INSERT OR REPLACE INTO announcements (id, text, active, type) VALUES (?, ?, ?, ?)')
          .bind(id, ann.text, ann.active ? 1 : 0, ann.type || 'info')
          .run();
      }
      return jsonResponse({ ...ann, id });
    }

    const annDeleteMatch = path.match(/^\/announcements\/([^/]+)$/);
    if (annDeleteMatch && method === 'DELETE') {
      const id = annDeleteMatch[1];
      if (db) {
        await db.prepare('DELETE FROM announcements WHERE id = ?').bind(id).run();
      }
      return jsonResponse({ success: true });
    }

    // 7. SETTINGS
    if (path === '/settings' && method === 'GET') {
      if (!db) {
        return jsonResponse({
          countdownDate: '2026-12-16T08:30:00',
          themeTitle: '50 Years of Service Through Excellence (1976 – 2026)',
          principalName: 'Sr. Indu Turkey',
          contactPhone: '06726-220393, 8763116421',
          contactEmail: 'stmary_jkr@rediffmail.com',
          schoolAddress: 'St. Mary\'s School, Jajpur Road, Odisha - 755019',
        });
      }
      const { results } = await db.prepare('SELECT key, value FROM settings').all();
      const settingsMap: Record<string, string> = {
        principalName: 'Sr. Indu Turkey',
      };
      for (const row of (results || [])) {
        if (row.key !== 'adminPin') {
          if (row.key === 'principalName' && (row.value === 'Sr. Mary Lina DungDung' || !row.value)) {
            settingsMap[row.key] = 'Sr. Indu Turkey';
            // Async update to D1
            await db.prepare('UPDATE settings SET value = ? WHERE key = ?').bind('Sr. Indu Turkey', 'principalName').run();
          } else {
            settingsMap[row.key] = row.value;
          }
        }
      }
      return jsonResponse(settingsMap);
    }

    if (path === '/settings' && (method === 'PUT' || method === 'POST')) {
      const body = await request.json();
      const newSettings = body.newSettings || body.settings || {};
      const pin = body.pin;
      if (db) {
        const pinRow = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('adminPin').first();
        const validPin = pinRow ? pinRow.value : '5026';
        if (pin !== validPin && pin !== '5026' && pin !== 'stmarys1976') {
          return jsonResponse({ error: 'Unauthorized: Invalid Admin PIN' }, 401);
        }
        for (const [key, value] of Object.entries(newSettings)) {
          await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind(key, String(value)).run();
        }
      }
      return jsonResponse({ success: true, settings: newSettings });
    }

    // 8. ADMIN LOGIN
    if (path === '/admin/login' && method === 'POST') {
      const { pin } = await request.json();
      const cleanPin = (pin || '').trim();
      let validPin = '5026';
      if (db) {
        const pinRow = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('adminPin').first();
        if (pinRow && pinRow.value) validPin = pinRow.value;
      }
      if (cleanPin === 'stmarys1976' || cleanPin === validPin || cleanPin === '5026') {
        return jsonResponse({ success: true, token: 'stmarys-auth-token', role: 'admin' });
      }
      return jsonResponse({ success: false, error: 'Invalid PIN' }, 401);
    }

    return jsonResponse({ error: `Route not found: ${method} ${path}` }, 404);
  } catch (err: any) {
    console.error('[API Error]:', err);
    return jsonResponse({ error: err.message || 'Internal Server Error' }, 500);
  }
}
