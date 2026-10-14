-- St. Mary's Golden Jubilee Initial Seed Data for Cloudflare D1

-- Events
INSERT OR IGNORE INTO events (id, title, date, time, venue, category, description, chiefGuest, rsvpCount, highlight) VALUES
('evt-1', 'Inaugural Thanksgiving Mass & Jubilee Blessing', '2026-12-16', '08:30 AM - 11:30 AM', 'St. Mary''s Main School Grounds & Chapel', 'Ceremony', 'Solemn Holy Eucharistic celebration of thanksgiving presided over by Archbishop of Cuttack-Bhubaneswar, blessing the Golden Jubilee memorial pillar and hoisting the Jubilee Flag.', 'Most Rev. Archbishop of Cuttack-Bhubaneswar', 342, 1),
('evt-2', 'Grand Alumni Global Homecoming & Nostalgia Gala', '2026-12-17', '04:00 PM - 09:30 PM', 'Father Marian Memorial Auditorium', 'Alumni', 'A historic reunion for alumni spanning batches 1976 through 2025. Featuring batch roll-calls, felicitation of retired teachers, campus memory walks, and an evening cultural musical night.', 'Distinguished Alumni Association Patrons', 528, 1),
('evt-3', 'Golden Jubilee Inter-School Cultural & Drama Fest', '2026-12-18', '09:00 AM - 04:00 PM', 'St. Mary''s Open Air Amphitheatre', 'Cultural', 'An elite inter-school cultural competition showcasing classical Odissi dance, western band performances, theatrical drama, and elocution on the theme "Service Through Excellence".', 'Eminent Odia Cultural Icons & Educationists', 215, 0),
('evt-4', 'Golden Jubilee Track & Field Sports Olympiad', '2026-12-19', '08:00 AM - 02:00 PM', 'School Athletic Stadium', 'Sports', 'March past by past and present house captains (Red, Blue, Green, Gold), athletic track events, tug-of-war between Alumni and Staff, and medal presentation ceremonies.', 'Renowned State Athletes & Sports Authorities', 180, 0),
('evt-5', 'Valedictory Grand Gala & Jubilee Souvenir Release', '2026-12-20', '05:30 PM - 10:00 PM', 'Central Jubilee Arena', 'Ceremony', 'Grand finale of the 50-year celebration with release of "Golden Pages: 50 Years of Marian Heritage" commemorative souvenir, grand laser fireworks display, and jubilee banquet.', 'Honorable State Education Dignitaries & Principal Sr. Mary Lina DungDung', 650, 1);

-- Timeline
INSERT OR IGNORE INTO timeline (id, year, title, description, era, iconType, badge) VALUES
('tl-1', 1976, 'The Foundation Stone Laid', 'Founded under the benevolent vision of the Catholic Archdiocese of Cuttack-Bhubaneswar and dedicated to Mother Mary to deliver disciplined English-medium education to the children of Jajpur Road and surrounding rural industrial belts.', 'Foundation (1976-1985)', 'School', 'Humble Genesis'),
('tl-2', 1982, 'First Secondary Batch & Affiliation Recognition', 'The school achieved official recognition and presented its first pioneer batch for formal secondary board examinations, establishing an unmatched record of 100% first-division results.', 'Foundation (1976-1985)', 'Award', 'Academic Prowess'),
('tl-3', 1989, 'Expansion of the Main Academic Block', 'With enrolment crossing 800 students, the iconic two-storied brick academic quadrangle was inaugurated along with state-of-the-art physics and biology laboratories.', 'Expansion (1986-2000)', 'BookOpen', 'Campus Growth'),
('tl-4', 1995, 'Introduction of Modern Computer Science Wing', 'Pioneering early technical literacy in the district, St. Mary''s established its first dedicated computing laboratory with 30 terminals, inaugurated by senior diocesan education patrons.', 'Expansion (1986-2000)', 'Laptop', 'Digital Pioneer'),
('tl-5', 2001, 'The Silver Jubilee Milestone (25 Years)', 'A week-long celebration marking a quarter-century of "Service Through Excellence", bringing together hundreds of alumni and laying the cornerstone for the silver jubilee library complex.', 'Silver Era (2001-2015)', 'Sparkles', 'Silver Jubilee'),
('tl-6', 2012, 'National Debate & Science Olympiad Laurels', 'Marian students secured top ranks in National Science Exhibitions and CISCE regional debating tournaments, cementing the school''s repute across eastern India.', 'Silver Era (2001-2015)', 'Trophy', 'National Laurels'),
('tl-7', 2018, 'Smart Classrooms & Solar Eco-Campus', 'Transformation into a green campus powered by rooftop solar generation, coupled with digital interactive smartboards in all classrooms from kindergarten to standard ten.', 'Golden Horizon (2016-2026)', 'Sun', 'Eco & Smart Campus'),
('tl-8', 2026, 'The 50th Golden Jubilee Year', 'Half a century of nurturing generations of doctors, engineers, civil servants, entrepreneurs, artists, and compassionate global citizens who serve humanity with excellence.', 'Golden Horizon (2016-2026)', 'Crown', 'Golden Landmark');

-- Initial Contributions
INSERT OR IGNORE INTO contributions (id, receiptNumber, donorName, role, batchYear, email, phone, amount, tier, paymentMethod, paymentRef, message, isAnonymous, createdAt, status) VALUES
('cnt-1', 'SMJ-GJ-2026-1001', 'Dr. Rajesh Kumar Mohanty', 'Alumnus', 'Batch of 1992', 'rajesh.mohanty@cardio.org', '+91 98450 12345', 25000.0, 'Diamond Visionary', 'UPI Payment', 'TXN-GJ-984210', 'In honor of our beloved teachers whose blessings gave me the wings to become a cardiac surgeon. Long live St. Mary''s!', 0, '2026-02-14T10:30:00.000Z', 'completed'),
('cnt-2', 'SMJ-GJ-2026-1002', 'Subhashree Priyadarshini Panda', 'Alumnus', 'Batch of 2004', 'subhashree.p@techcorp.in', '+91 99370 88211', 10000.0, 'Platinum Benefactor', 'UPI Payment', 'TXN-GJ-482103', 'Forever indebted to Sister Principal and the Marian sisters for shaping my character and career.', 0, '2026-02-18T14:15:00.000Z', 'completed'),
('cnt-3', 'SMJ-GJ-2026-1003', 'Er. Alok Ranjan Samal', 'Alumnus', 'Batch of 1998', 'alok.samal@infrastructure.in', '+91 94370 54129', 15000.0, 'Platinum Benefactor', 'UPI Payment', 'TXN-GJ-771249', 'Proud Marian. Dedicated to the upcoming Golden Jubilee Memorial Science Center.', 0, '2026-02-22T09:45:00.000Z', 'completed'),
('cnt-4', 'SMJ-GJ-2026-1004', 'Sanjay Kumar Rout & Family', 'Parent', NULL, 'sanjay.rout77@gmail.com', '+91 98610 33418', 5000.0, 'Golden Patron', 'UPI Payment', 'TXN-GJ-310492', 'Both my daughters studied here and grew into confident leaders. St. Mary''s is our pride.', 0, '2026-02-25T16:20:00.000Z', 'completed'),
('cnt-5', 'SMJ-GJ-2026-1005', 'Marian Class of 2010 Collective', 'Alumnus', 'Batch of 2010', 'batch2010.marians@gmail.com', '+91 97760 11984', 50000.0, 'Diamond Visionary', 'UPI Payment', 'TXN-GJ-884102', 'Combined batch contribution from 42 batchmates across India, UAE, and the UK. Fifty glorious years!', 0, '2026-03-01T11:00:00.000Z', 'completed');

-- Initial Wishes
INSERT OR IGNORE INTO wishes (id, name, batchYear, role, city, message, createdAt) VALUES
('wsh-1', 'Amitav Patnaik', 'Batch of 1988', 'Alumnus', 'Bengaluru, India', 'Hearty congratulations to our Alma Mater! The morning prayers, assembly hymns, and Sister’s words remain etched in my soul. Golden Jubilee blessings!', '2026-02-15T08:20:00.000Z'),
('wsh-2', 'Madhusmita Behera', 'Batch of 2001', 'Alumna', 'London, UK', '50 years of shaping young dreams. Feeling blessed to have walked those corridors. Sending love from London to all my teachers.', '2026-02-20T12:45:00.000Z'),
('wsh-3', 'Debabrata Das', 'Batch of 2015', 'Alumnus', 'Jajpur Road, Odisha', 'Still remember playing football on the school field. Proud to be a Marian always. Can’t wait for the grand alumni reunion in December!', '2026-02-28T18:10:00.000Z');

-- Initial Announcements
INSERT OR IGNORE INTO announcements (id, text, active, type) VALUES
('anc-1', '🎉 St. Mary''s Golden Jubilee (1976 - 2026) Celebrations announced! Registrations open for the Global Alumni Homecoming.', 1, 'urgent'),
('anc-2', '📜 Commemorative Jubilee Souvenir submissions open: Alumni and well-wishers are invited to contribute fond memories & articles.', 1, 'info'),
('anc-3', '🏛️ Golden Jubilee Auditorium & Labs Endowment: Support the historic infrastructure development through the Patron Fund.', 1, 'highlight');

-- Initial Settings
INSERT OR REPLACE INTO settings (key, value) VALUES
('countdownDate', '2026-12-16T08:30:00'),
('themeTitle', '50 Years of Service Through Excellence (1976 – 2026)'),
('principalName', 'Sr. Mary Lina DungDung'),
('contactPhone', '06726-220393, 8763116421'),
('contactEmail', 'stmary_jkr@rediffmail.com'),
('schoolAddress', 'St. Mary''s School, Jajpur Road, Odisha - 755019'),
('adminPin', '5026');
