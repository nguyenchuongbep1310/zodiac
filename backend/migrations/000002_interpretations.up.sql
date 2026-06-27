-- ─── Interpretation Templates ─────────────────────────────────────────────────
--
-- factor_type covers three lookup kinds:
--   'planet_in_sign'   factor_value_1=planet  factor_value_2=sign    factor_value_3=NULL
--   'planet_in_house'  factor_value_1=planet  factor_value_2=house#  factor_value_3=NULL
--   'aspect'           factor_value_1=planet1 factor_value_2=planet2 factor_value_3=aspect_type
--
-- Planet pairs in aspects are stored with planet1 < planet2 alphabetically to
-- prevent duplicate rows and match the constraint on the aspects table.
--
-- language uses BCP-47 short codes: 'en' | 'vi'

CREATE TABLE IF NOT EXISTS interpretation_templates (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    language        VARCHAR(10) NOT NULL,           -- 'en' | 'vi'
    factor_type     VARCHAR(50) NOT NULL,           -- 'planet_in_sign' | 'planet_in_house' | 'aspect'
    factor_value_1  VARCHAR(50) NOT NULL,           -- planet name
    factor_value_2  VARCHAR(50) NOT NULL,           -- sign / house number / second planet
    factor_value_3  VARCHAR(50)     NULL,           -- aspect type (only for 'aspect' rows)
    title           VARCHAR(255)    NULL,           -- short heading (optional)
    content         TEXT        NOT NULL,           -- main interpretation body
    keywords        TEXT[]      NOT NULL DEFAULT '{}',  -- searchable keyword tags
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Primary lookup: exact match on all factor columns + language + active flag.
-- This is the hot path hit by the service on every chart interpretation request.
CREATE UNIQUE INDEX IF NOT EXISTS idx_interp_lookup
    ON interpretation_templates (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
    WHERE is_active = TRUE AND factor_value_3 IS NOT NULL;

-- Separate unique index for rows where factor_value_3 IS NULL (planet_in_sign / planet_in_house)
-- because NULL != NULL in standard SQL unique indexes.
CREATE UNIQUE INDEX IF NOT EXISTS idx_interp_lookup_no_v3
    ON interpretation_templates (language, factor_type, factor_value_1, factor_value_2)
    WHERE is_active = TRUE AND factor_value_3 IS NULL;

-- GIN index on keywords for full-text tag searches.
CREATE INDEX IF NOT EXISTS idx_interp_keywords
    ON interpretation_templates USING GIN (keywords);

-- ── Seed: English interpretations ─────────────────────────────────────────────

-- Sun in Signs
INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, title, content, keywords) VALUES
('en','planet_in_sign','Sun','Aries',    'Sun in Aries',    'Your core identity is driven by initiative, courage, and a pioneering spirit. You lead with boldness and thrive when charting new territory.', ARRAY['leadership','bold','fire','initiative']),
('en','planet_in_sign','Sun','Taurus',   'Sun in Taurus',   'Your core identity is anchored in stability, sensory pleasure, and patient determination. You build slowly but create lasting foundations.', ARRAY['stability','earth','patience','material']),
('en','planet_in_sign','Sun','Gemini',   'Sun in Gemini',   'Your identity is shaped by curiosity, versatility, and communication. You thrive on variety and intellectual exchange.', ARRAY['communication','air','dual','curious']),
('en','planet_in_sign','Sun','Cancer',   'Sun in Cancer',   'Emotional depth, nurturing instincts, and a strong connection to home and family define your core self.', ARRAY['nurture','water','home','emotional']),
('en','planet_in_sign','Sun','Leo',      'Sun in Leo',      'Creativity, self-expression, and a warm generous heart form your identity. You shine brightest when given a stage.', ARRAY['creative','fire','generous','confidence']),
('en','planet_in_sign','Sun','Virgo',    'Sun in Virgo',    'Analytical precision, service orientation, and a sharp eye for detail are the hallmarks of your solar identity.', ARRAY['analytical','earth','service','detail']),
('en','planet_in_sign','Sun','Libra',    'Sun in Libra',    'Balance, harmony, and refined aesthetic sensibility define who you are. You are at your best in partnership and diplomacy.', ARRAY['balance','air','harmony','diplomat']),
('en','planet_in_sign','Sun','Scorpio',  'Sun in Scorpio',  'Intensity, transformative power, and penetrating insight shape your core identity. You are drawn to depth over surface.', ARRAY['intensity','water','transformation','power']),
('en','planet_in_sign','Sun','Sagittarius','Sun in Sagittarius','Philosophical vision, love of freedom, and an optimistic quest for truth define your solar nature.', ARRAY['freedom','fire','philosophy','optimism']),
('en','planet_in_sign','Sun','Capricorn','Sun in Capricorn','Disciplined ambition, structural thinking, and long-term planning are the cornerstones of your identity.', ARRAY['ambition','earth','discipline','career']),
('en','planet_in_sign','Sun','Aquarius', 'Sun in Aquarius', 'Humanitarian ideals, intellectual independence, and a drive to innovate shape your sense of self.', ARRAY['innovation','air','humanitarian','independence']),
('en','planet_in_sign','Sun','Pisces',   'Sun in Pisces',   'Compassion, imagination, and a mystical attunement to the unseen world define your solar identity.', ARRAY['compassion','water','mystical','imagination']);

-- Moon in Signs (abbreviated sample — extend with all 12)
INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, title, content, keywords) VALUES
('en','planet_in_sign','Moon','Aries',   'Moon in Aries',   'Your emotional responses are quick, direct, and fiery. You need action to feel emotionally satisfied.', ARRAY['impulsive','fire','emotional','reactive']),
('en','planet_in_sign','Moon','Taurus',  'Moon in Taurus',  'Emotional security comes through comfort, routine, and sensory pleasures. You are loyal and deeply steadfast.', ARRAY['security','earth','comfort','steadfast']),
('en','planet_in_sign','Moon','Gemini',  'Moon in Gemini',  'Emotional wellbeing depends on mental stimulation and variety. You process feelings through conversation.', ARRAY['mental','air','verbal','changeable']),
('en','planet_in_sign','Moon','Cancer',  'Moon in Cancer',  'You are the Moon''s natural home: deeply intuitive, nurturing, and sensitive to emotional undercurrents.', ARRAY['intuitive','water','nurture','home']),
('en','planet_in_sign','Moon','Leo',     'Moon in Leo',     'You need recognition and warmth to feel emotionally nourished. Drama and creativity fuel your inner world.', ARRAY['recognition','fire','drama','warmth']),
('en','planet_in_sign','Moon','Virgo',   'Moon in Virgo',   'Emotional comfort comes through being useful, organised, and through acts of practical care.', ARRAY['practical','earth','service','organised']),
('en','planet_in_sign','Moon','Libra',   'Moon in Libra',   'You find emotional peace in beauty, fairness, and harmonious relationships.', ARRAY['harmony','air','beauty','relationships']),
('en','planet_in_sign','Moon','Scorpio', 'Moon in Scorpio', 'Emotions run deep and intense. You guard vulnerability carefully but feel everything profoundly.', ARRAY['intense','water','depth','private']),
('en','planet_in_sign','Moon','Sagittarius','Moon in Sagittarius','Emotional freedom and the pursuit of meaning bring you inner joy. Confinement is your greatest discomfort.', ARRAY['freedom','fire','meaning','adventurous']),
('en','planet_in_sign','Moon','Capricorn','Moon in Capricorn','You manage emotions with restraint and find security through achievement and social standing.', ARRAY['restraint','earth','achievement','stoic']),
('en','planet_in_sign','Moon','Aquarius','Moon in Aquarius','Your emotional needs are met through intellectual community and idealistic causes rather than personal intimacy.', ARRAY['community','air','idealistic','detached']),
('en','planet_in_sign','Moon','Pisces',  'Moon in Pisces',  'You are boundlessly empathetic and spiritually attuned, absorbing the emotional atmosphere around you.', ARRAY['empathy','water','spiritual','sensitive']);

-- Sun in Houses (sample)
INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, title, content, keywords) VALUES
('en','planet_in_house','Sun','1',  'Sun in House 1', 'You project a strong, self-assured identity. Life is experienced as a direct expression of personal will.', ARRAY['identity','self','projection','vitality']),
('en','planet_in_house','Sun','2',  'Sun in House 2', 'Your sense of self is closely tied to material security, personal values, and financial independence.', ARRAY['money','values','material','security']),
('en','planet_in_house','Sun','3',  'Sun in House 3', 'Self-expression through communication, writing, and local connection gives your life purpose.', ARRAY['communication','siblings','local','writing']),
('en','planet_in_house','Sun','4',  'Sun in House 4', 'Home, ancestry, and family roots are the foundation of your identity and life purpose.', ARRAY['home','family','roots','private']),
('en','planet_in_house','Sun','5',  'Sun in House 5', 'Creativity, romance, and self-expression are central to your solar purpose. You are at your most vital when playing.', ARRAY['creativity','romance','play','children']),
('en','planet_in_house','Sun','6',  'Sun in House 6', 'Your identity is bound up in work, craft, and health routines. Service and precision give you purpose.', ARRAY['work','health','service','routine']),
('en','planet_in_house','Sun','7',  'Sun in House 7', 'Partnership is a mirror for your deepest self. You discover who you are through significant one-on-one relationships.', ARRAY['partnership','marriage','mirror','other']),
('en','planet_in_house','Sun','8',  'Sun in House 8', 'Transformation, shared resources, and the mysteries of life and death are your solar domain.', ARRAY['transformation','shared','depth','occult']),
('en','planet_in_house','Sun','9',  'Sun in House 9', 'Philosophy, long-distance travel, and the pursuit of higher knowledge define your solar path.', ARRAY['philosophy','travel','education','belief']),
('en','planet_in_house','Sun','10', 'Sun in House 10','Career, public reputation, and achievement are the arena in which your solar identity shines brightest.', ARRAY['career','status','public','ambition']),
('en','planet_in_house','Sun','11', 'Sun in House 11','Your purpose is found in community, friendship, and visionary social causes.', ARRAY['community','friends','vision','social']),
('en','planet_in_house','Sun','12', 'Sun in House 12','Solitude, spiritual practice, and hidden depths nourish your solar identity in ways invisible to others.', ARRAY['solitude','spiritual','hidden','retreat']);

-- Moon in Houses (sample)
INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, title, content, keywords) VALUES
('en','planet_in_house','Moon','1',  'Moon in House 1', 'Your emotional world is immediately visible to others. Moods shift readily and you are highly sensitive to your environment.', ARRAY['visible','sensitive','fluctuating','instinctive']),
('en','planet_in_house','Moon','4',  'Moon in House 4', 'The Moon is powerful in its natural house. Home and family are your emotional bedrock.', ARRAY['home','family','roots','stronghold']),
('en','planet_in_house','Moon','7',  'Moon in House 7', 'Emotional fulfilment is found through close partnership. You seek a nurturing, emotionally safe relationship.', ARRAY['partnership','nurture','relationship','safety']),
('en','planet_in_house','Moon','10', 'Moon in House 10','Your emotional needs and professional ambitions are intertwined. Public life has a strongly emotional flavour.', ARRAY['career','public','emotional','ambition']);

-- Aspects (sample — extend with all key pairs)
INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, factor_value_3, title, content, keywords) VALUES
('en','aspect','Moon','Sun','conjunction', 'Sun–Moon Conjunction','Your conscious will and emotional instincts are fused into a unified drive. What you want and what you feel are rarely in conflict.', ARRAY['unity','identity','instinct','integration']),
('en','aspect','Moon','Sun','trine',       'Sun–Moon Trine',      'A natural harmony between your ego and emotional nature creates a well-integrated, confident character.', ARRAY['harmony','ease','integration','confidence']),
('en','aspect','Moon','Sun','square',      'Sun–Moon Square',     'Inner tension between your desires and emotional needs propels growth through recurring challenges.', ARRAY['tension','growth','challenge','conflict']),
('en','aspect','Moon','Sun','opposition',  'Sun–Moon Opposition', 'A polarity between self-assertion and emotional receptivity plays out through projection onto others.', ARRAY['polarity','projection','balance','awareness']),
('en','aspect','Moon','Sun','sextile',     'Sun–Moon Sextile',    'Opportunities arise naturally from the flowing cooperation between your will and your feelings.', ARRAY['opportunity','flow','cooperation','ease']),
('en','aspect','Mars','Sun','conjunction', 'Sun–Mars Conjunction','Vitality and assertive drive are amplified. You act decisively and project a confident, energetic presence.', ARRAY['energy','action','drive','assertive']),
('en','aspect','Mars','Sun','square',      'Sun–Mars Square',     'Frustrated will creates tension that fuels ambitious striving. Learn to channel aggression constructively.', ARRAY['friction','ambition','aggression','striving']),
('en','aspect','Mars','Sun','trine',       'Sun–Mars Trine',      'Your drive and identity work in elegant harmony. Physical courage and confident action come naturally.', ARRAY['courage','action','harmony','physical']),
('en','aspect','Saturn','Sun','conjunction','Sun–Saturn Conjunction','Discipline and responsibility are woven into your identity. Authority and structure define your path.', ARRAY['discipline','authority','responsibility','structure']),
('en','aspect','Saturn','Sun','square',    'Sun–Saturn Square',   'Self-doubt and external obstacles test your solar purpose. Persistence in the face of limitation is your key lesson.', ARRAY['limitation','perseverance','test','maturity']),
('en','aspect','Jupiter','Sun','trine',    'Sun–Jupiter Trine',   'Luck, optimism, and expansive vision support your self-expression. You attract abundance with relative ease.', ARRAY['luck','expansion','optimism','abundance']),
('en','aspect','Venus','Sun','conjunction','Sun–Venus Conjunction','Charm, aesthetics, and the desire for harmony are central to how you present yourself.', ARRAY['charm','beauty','social','harmony']);

-- ── Seed: Vietnamese interpretations ─────────────────────────────────────────

-- Mặt Trời trong Cung Hoàng Đạo
INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, title, content, keywords) VALUES
('vi','planet_in_sign','Sun','Aries',    'Mặt Trời trong Bạch Dương', 'Bản sắc cốt lõi của bạn được thúc đẩy bởi sự chủ động, can đảm và tinh thần tiên phong. Bạn dẫn đầu bằng sự táo bạo.', ARRAY['lãnh đạo','dũng cảm','lửa','chủ động']),
('vi','planet_in_sign','Sun','Taurus',   'Mặt Trời trong Kim Ngưu',   'Bản sắc của bạn được neo chặt vào sự ổn định, khoái cảm giác quan và sự kiên nhẫn bền bỉ. Bạn xây dựng chậm nhưng bền vững.', ARRAY['ổn định','đất','kiên nhẫn','vật chất']),
('vi','planet_in_sign','Sun','Gemini',   'Mặt Trời trong Song Tử',   'Bản sắc của bạn được định hình bởi sự tò mò, linh hoạt và khả năng giao tiếp xuất sắc.', ARRAY['giao tiếp','không khí','đôi','tò mò']),
('vi','planet_in_sign','Sun','Cancer',   'Mặt Trời trong Cự Giải',   'Chiều sâu cảm xúc, bản năng nuôi dưỡng và gắn kết mạnh mẽ với gia đình định hình cái tôi cốt lõi của bạn.', ARRAY['nuôi dưỡng','nước','gia đình','cảm xúc']),
('vi','planet_in_sign','Sun','Leo',      'Mặt Trời trong Sư Tử',     'Sáng tạo, tự thể hiện và trái tim ấm áp hào phóng tạo nên bản sắc của bạn. Bạn tỏa sáng nhất khi được đứng trên sân khấu.', ARRAY['sáng tạo','lửa','hào phóng','tự tin']),
('vi','planet_in_sign','Sun','Virgo',    'Mặt Trời trong Xử Nữ',     'Sự phân tích chính xác, định hướng phục vụ và mắt tinh tế là dấu hiệu của bản thể mặt trời của bạn.', ARRAY['phân tích','đất','phục vụ','chi tiết']),
('vi','planet_in_sign','Sun','Libra',    'Mặt Trời trong Thiên Bình', 'Cân bằng, hài hòa và thẩm mỹ tinh tế định nghĩa bạn là ai. Bạn tốt nhất trong quan hệ đối tác và ngoại giao.', ARRAY['cân bằng','không khí','hài hòa','ngoại giao']),
('vi','planet_in_sign','Sun','Scorpio',  'Mặt Trời trong Bọ Cạp',    'Cường độ, sức mạnh biến đổi và cái nhìn sâu sắc xuyên suốt định hình bản sắc cốt lõi của bạn.', ARRAY['cường độ','nước','biến đổi','quyền lực']),
('vi','planet_in_sign','Sun','Sagittarius','Mặt Trời trong Nhân Mã','Tầm nhìn triết học, tình yêu tự do và cuộc tìm kiếm lạc quan về chân lý định nghĩa bản chất mặt trời của bạn.', ARRAY['tự do','lửa','triết học','lạc quan']),
('vi','planet_in_sign','Sun','Capricorn','Mặt Trời trong Ma Kết',    'Tham vọng có kỷ luật, tư duy cấu trúc và kế hoạch dài hạn là nền tảng của bản sắc của bạn.', ARRAY['tham vọng','đất','kỷ luật','sự nghiệp']),
('vi','planet_in_sign','Sun','Aquarius', 'Mặt Trời trong Bảo Bình',  'Lý tưởng nhân đạo, độc lập trí tuệ và khao khát đổi mới định hình ý thức về bản thân của bạn.', ARRAY['đổi mới','không khí','nhân đạo','độc lập']),
('vi','planet_in_sign','Sun','Pisces',   'Mặt Trời trong Song Ngư',  'Lòng trắc ẩn, trí tưởng tượng và sự thấu cảm huyền bí với thế giới vô hình định nghĩa bản sắc mặt trời của bạn.', ARRAY['trắc ẩn','nước','huyền bí','tưởng tượng']);

-- Mặt Trăng trong Cung Hoàng Đạo
INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, title, content, keywords) VALUES
('vi','planet_in_sign','Moon','Aries',   'Mặt Trăng trong Bạch Dương','Phản ứng cảm xúc của bạn nhanh chóng, trực tiếp và bốc lửa. Bạn cần hành động để cảm thấy hài lòng về mặt cảm xúc.', ARRAY['bốc đồng','lửa','cảm xúc','phản ứng']),
('vi','planet_in_sign','Moon','Taurus',  'Mặt Trăng trong Kim Ngưu',  'An toàn cảm xúc đến qua sự thoải mái, thói quen và niềm vui giác quan. Bạn trung thành và kiên định sâu sắc.', ARRAY['an toàn','đất','thoải mái','kiên định']),
('vi','planet_in_sign','Moon','Gemini',  'Mặt Trăng trong Song Tử',  'Sức khỏe cảm xúc phụ thuộc vào kích thích tinh thần và sự đa dạng. Bạn xử lý cảm xúc qua giao tiếp.', ARRAY['tinh thần','không khí','ngôn từ','thay đổi']),
('vi','planet_in_sign','Moon','Cancer',  'Mặt Trăng trong Cự Giải',  'Bạn là ngôi nhà tự nhiên của Mặt Trăng: rất trực giác, nuôi dưỡng và nhạy cảm với các dòng chảy cảm xúc.', ARRAY['trực giác','nước','nuôi dưỡng','nhà']),
('vi','planet_in_sign','Moon','Leo',     'Mặt Trăng trong Sư Tử',    'Bạn cần sự công nhận và ấm áp để được nuôi dưỡng về mặt cảm xúc. Kịch tính và sáng tạo thúc đẩy thế giới nội tâm của bạn.', ARRAY['công nhận','lửa','kịch tính','ấm áp']),
('vi','planet_in_sign','Moon','Virgo',   'Mặt Trăng trong Xử Nữ',   'Sự thoải mái cảm xúc đến qua sự hữu ích, có tổ chức và qua các hành động chăm sóc thực tế.', ARRAY['thực tế','đất','phục vụ','có tổ chức']),
('vi','planet_in_sign','Moon','Libra',   'Mặt Trăng trong Thiên Bình','Bạn tìm thấy sự bình yên cảm xúc trong vẻ đẹp, sự công bằng và các mối quan hệ hài hòa.', ARRAY['hài hòa','không khí','vẻ đẹp','mối quan hệ']),
('vi','planet_in_sign','Moon','Scorpio', 'Mặt Trăng trong Bọ Cạp',   'Cảm xúc chạy sâu và mãnh liệt. Bạn bảo vệ sự dễ bị tổn thương cẩn thận nhưng cảm nhận mọi thứ sâu sắc.', ARRAY['mãnh liệt','nước','chiều sâu','riêng tư']),
('vi','planet_in_sign','Moon','Sagittarius','Mặt Trăng trong Nhân Mã','Tự do cảm xúc và việc theo đuổi ý nghĩa mang lại niềm vui nội tâm cho bạn.', ARRAY['tự do','lửa','ý nghĩa','phiêu lưu']),
('vi','planet_in_sign','Moon','Capricorn','Mặt Trăng trong Ma Kết',   'Bạn quản lý cảm xúc với sự kiềm chế và tìm thấy sự an toàn qua thành tích.', ARRAY['kiềm chế','đất','thành tích','điềm tĩnh']),
('vi','planet_in_sign','Moon','Aquarius','Mặt Trăng trong Bảo Bình',  'Nhu cầu cảm xúc được đáp ứng qua cộng đồng trí tuệ và các lý tưởng hơn là sự thân mật cá nhân.', ARRAY['cộng đồng','không khí','lý tưởng','tách biệt']),
('vi','planet_in_sign','Moon','Pisces',  'Mặt Trăng trong Song Ngư',  'Bạn có sự đồng cảm vô hạn và được hòa hợp tâm linh, hấp thụ bầu không khí cảm xúc xung quanh bạn.', ARRAY['đồng cảm','nước','tâm linh','nhạy cảm']);

-- Mặt Trời trong Nhà
INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, title, content, keywords) VALUES
('vi','planet_in_house','Sun','1',  'Mặt Trời trong Nhà 1',  'Bạn thể hiện bản sắc mạnh mẽ và tự tin. Cuộc sống là sự thể hiện trực tiếp của ý chí cá nhân.', ARRAY['bản sắc','bản thân','thể hiện','sinh lực']),
('vi','planet_in_house','Sun','2',  'Mặt Trời trong Nhà 2',  'Cảm giác về bản thân của bạn gắn chặt với an ninh vật chất, các giá trị cá nhân và sự độc lập tài chính.', ARRAY['tiền bạc','giá trị','vật chất','an ninh']),
('vi','planet_in_house','Sun','4',  'Mặt Trời trong Nhà 4',  'Nhà cửa, tổ tiên và rễ gia đình là nền tảng cho bản sắc và mục đích sống của bạn.', ARRAY['nhà','gia đình','gốc rễ','riêng tư']),
('vi','planet_in_house','Sun','7',  'Mặt Trời trong Nhà 7',  'Quan hệ đối tác là tấm gương phản chiếu cái tôi sâu thẳm nhất của bạn.', ARRAY['đối tác','hôn nhân','gương','người khác']),
('vi','planet_in_house','Sun','10', 'Mặt Trời trong Nhà 10', 'Sự nghiệp, danh tiếng và thành tích là đấu trường mà bản sắc mặt trời của bạn tỏa sáng rực rỡ nhất.', ARRAY['sự nghiệp','địa vị','công cộng','tham vọng']);

-- Các góc chiếu (Aspects)
INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, factor_value_3, title, content, keywords) VALUES
('vi','aspect','Moon','Sun','conjunction', 'Hội tinh Mặt Trời – Mặt Trăng','Ý chí có ý thức và bản năng cảm xúc của bạn hợp nhất thành một động lực thống nhất. Điều bạn muốn và điều bạn cảm nhận hiếm khi xung đột.', ARRAY['thống nhất','bản sắc','bản năng','hội tụ']),
('vi','aspect','Moon','Sun','trine',       'Tam hợp Mặt Trời – Mặt Trăng','Sự hòa hợp tự nhiên giữa bản ngã và bản chất cảm xúc tạo ra tính cách hội tụ và tự tin.', ARRAY['hài hòa','dễ dàng','hội tụ','tự tin']),
('vi','aspect','Moon','Sun','square',      'Vuông góc Mặt Trời – Mặt Trăng','Căng thẳng nội tâm giữa mong muốn và nhu cầu cảm xúc thúc đẩy sự phát triển qua những thách thức lặp đi lặp lại.', ARRAY['căng thẳng','phát triển','thách thức','xung đột']),
('vi','aspect','Moon','Sun','opposition',  'Đối chiếu Mặt Trời – Mặt Trăng','Sự phân cực giữa tự khẳng định và tiếp nhận cảm xúc diễn ra qua sự chiếu lên người khác.', ARRAY['phân cực','chiếu','cân bằng','nhận thức']),
('vi','aspect','Moon','Sun','sextile',     'Lục phân Mặt Trời – Mặt Trăng','Cơ hội nảy sinh tự nhiên từ sự hợp tác trôi chảy giữa ý chí và cảm xúc của bạn.', ARRAY['cơ hội','dòng chảy','hợp tác','dễ dàng']),
('vi','aspect','Mars','Sun','conjunction', 'Hội tinh Mặt Trời – Sao Hỏa',  'Sinh lực và động lực quyết đoán được khuếch đại. Bạn hành động quyết đoán và tỏa ra sự tự tin năng động.', ARRAY['năng lượng','hành động','động lực','quyết đoán']),
('vi','aspect','Mars','Sun','square',      'Vuông góc Mặt Trời – Sao Hỏa', 'Ý chí bị cản trở tạo ra căng thẳng thúc đẩy khát vọng đầy tham vọng. Học cách hướng sự hung hăng một cách xây dựng.', ARRAY['ma sát','tham vọng','hung hăng','phấn đấu']),
('vi','aspect','Saturn','Sun','conjunction','Hội tinh Mặt Trời – Sao Thổ','Kỷ luật và trách nhiệm được dệt vào bản sắc của bạn. Thẩm quyền và cấu trúc định nghĩa con đường của bạn.', ARRAY['kỷ luật','thẩm quyền','trách nhiệm','cấu trúc']),
('vi','aspect','Jupiter','Sun','trine',    'Tam hợp Mặt Trời – Sao Mộc',  'May mắn, lạc quan và tầm nhìn mở rộng hỗ trợ sự tự thể hiện của bạn. Bạn thu hút sự phong phú một cách tương đối dễ dàng.', ARRAY['may mắn','mở rộng','lạc quan','phong phú']);
