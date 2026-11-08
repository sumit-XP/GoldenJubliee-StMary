-- St. Mary's Golden Jubilee Initial Seed Data for Cloudflare D1 (Production Ready)

-- Clean old event and timeline entries
DELETE FROM events;
DELETE FROM timeline;

-- Events (Official 3-Day Golden Jubilee Festivities)
INSERT OR REPLACE INTO events (id, title, date, time, venue, category, description, chiefGuest, rsvpCount, highlight) VALUES
('evt-1', 'Inaugural Thanksgiving Mass & Committee Assembly', '2026-12-16', '08:30 AM - 01:30 PM', 'St. Mary''s Main School Grounds & Chapel', 'Ceremony', 'Solemn inaugural gathering exclusively for school members, teaching and non-teaching staff, Sisters, and the Managing Committee. Features Holy Eucharistic Mass of Thanksgiving, blessing of the Golden Jubilee Memorial, and committee felicitation.', 'Diocesan Patrons & School Managing Committee', 0, 1),
('evt-2', 'Observation of Golden Jubilee — Day 1: Grand Celebrations & Alumni Homecoming', '2026-12-17', '09:00 AM - 08:30 PM', 'Father Marian Memorial Auditorium & Campus Grounds', 'Alumni', 'Official public observation of the 50th Golden Jubilee open for all alumni, students, parents, and well-wishers. Features the grand jubilee assembly, global alumni homecoming spanning batches 1976–2025, felicitation of retired teachers, campus memory walk, and evening cultural musical concert.', 'Distinguished Alumni Association Patrons & State Dignitaries', 0, 1),
('evt-3', 'Observation of Golden Jubilee — Day 2: Grand Cultural Fest & Valedictory Gala', '2026-12-18', '09:30 AM - 09:30 PM', 'Central Jubilee Arena & Open Air Amphitheatre', 'Cultural', 'Grand Day 2 observation of the Golden Jubilee showcasing student dance drama, classical Odissi recitals, release of the 50th Anniversary Commemorative Souvenir ("Golden Pages"), awards ceremony, and grand jubilee valedictory banquet.', 'Honorable State Education Dignitaries & Principal Sr. Indu Turkey', 0, 1);

-- Timeline (Real 50-Year Milestones 1976-2026)
INSERT OR REPLACE INTO timeline (id, year, title, description, era, iconType, badge) VALUES
('tl-1', 1976, 'Foundation of St. Mary''s School', 'Established under the visionary patronage of Cuttack Roman Catholic Diocesan Corporation (CRCDC) Archdiocese of Cuttack-Bhubaneswar to bring quality English medium education to Jajpur Road.', 'Foundation (1976-1985)', 'School', 'Humble Beginnings'),
('tl-2', 1982, 'Stewardship of the Sisters of Handmaids of Mary', 'The Sisters joined the mission, instilling disciplined values, compassion, moral stewardship, and establishing our motto: "Service Through Excellence".', 'Foundation (1976-1985)', 'Award', 'Spiritual Heritage'),
('tl-3', 1989, 'Affiliation with CISCE / ICSE New Delhi', 'The school gained formal affiliation with the Council for the Indian School Certificate Examinations (CISCE). The pioneer batch produced outstanding state ranks.', 'Expansion (1986-2000)', 'BookOpen', 'Academic Milestone'),
('tl-4', 1996, 'Inauguration of Modern Science Complex', 'Dedicated Physics, Chemistry, and Biology laboratories inaugurated alongside a state-of-the-art computer education facility.', 'Expansion (1986-2000)', 'Laptop', 'Infrastructure'),
('tl-5', 2001, 'Silver Jubilee Celebration (25 Years)', 'Celebrated a quarter-century of educational brilliance with the construction of the Silver Jubilee Academic Block and the first grand Alumni meet.', 'Silver Era (2001-2015)', 'Sparkles', 'Silver Jubilee'),
('tl-isro', '2005-2018', 'ISRO Educational Visits by Students', 'Marian students embarked on prestigious study and educational visits to the Indian Space Research Organisation (ISRO), exploring satellite launch technology, space applications, and fostering scientific inquiry and innovation.', 'Silver Era (2001-2015)', 'Compass', 'ISRO Space Exposure'),
('tl-6', 2011, 'Auditorium & Multipurpose Sports Ground', 'Inauguration of Father Marian Multipurpose Auditorium, standard basketball and volleyball courts, expanding cultural and physical training programs.', 'Silver Era (2001-2015)', 'Trophy', 'Campus Growth'),
('tl-7', 2018, 'Smart Digital Classrooms & STEM Labs', 'Transformation into interactive smart classrooms equipped with multimedia visual aids, digital coding labs, and enriched library archives.', 'Golden Horizon (2016-2026)', 'Laptop', 'Tech Innovation'),
('tl-8', 2024, 'Eco-Green Campus & Golden Jubilee Project Initiation', 'Installation of rooftop solar infrastructure, rainwater harvesting, and rollout of the Golden Jubilee Multipurpose Student Centre project.', 'Golden Horizon (2016-2026)', 'Sun', 'Green Campus'),
('tl-chess', 2026, 'State-Level Chess Competition', 'St. Mary''s School proudly hosted the prestigious State-Level Chess Championship, bringing together budding chess prodigies and school teams from across Odisha to showcase tactical mastery and sportsmanship.', 'Golden Horizon (2016-2026)', 'Award', 'State Championship'),
('tl-9', 2026, 'The Golden Jubilee: 50 Glorious Years of Excellence', 'Half a century of nurturing leaders, doctors, engineers, educators, civil servants, and honest citizens. Proudly celebrating 1976 – 2026!', 'Golden Horizon (2016-2026)', 'Crown', '50 Years Landmark');

-- Initial Announcements
INSERT OR REPLACE INTO announcements (id, text, active, type) VALUES
('anc-1', '✨ Welcome to the 50th Golden Jubilee (1976–2026) of St. Mary''s School, Jajpur Road! Dec 16: School Members & Committee | Dec 17 & 18: Grand Golden Jubilee Observation.', 1, 'highlight'),
('anc-2', '📢 Alumni Global Meet RSVP is open for Batches 1976–2025 for the Golden Jubilee Observation on Dec 17 & 18. Please RSVP on the Events tab.', 1, 'info'),
('anc-3', '🏛️ Golden Jubilee Auditorium & Labs Endowment: Support the historic infrastructure development through the Patron Fund.', 1, 'highlight');

-- Initial Settings
INSERT OR REPLACE INTO settings (key, value) VALUES
('countdownDate', '2026-12-16T08:30:00'),
('themeTitle', '50 Years of Service Through Excellence (1976 – 2026)'),
('principalName', 'Sr. Indu Turkey'),
('contactPhone', '06726-220393, 8763116421'),
('contactEmail', 'stmary_jkr@rediffmail.com'),
('schoolAddress', 'St. Mary''s School, Jajpur Road, Odisha - 755019'),
('adminPin', '5026');


