-- FIX VIETNAMESE INTERPRETATIONS IN PLACEMENT_INTERPRETATIONS

-- 1. Upsert Vietnamese house_in_sign for House 1 (all 12 signs)
INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Aries', '', 'Bản ngã được tôi luyện qua hành động, sự độc lập và lòng quả cảm tiên phong. Bạn nhìn nhận cuộc sống như một hành trình khám phá và chinh phục không ngừng.', 'Bạn tiếp cận cuộc sống trực diện với nguồn năng lượng dồi dào. Bạn luôn là người đầu tiên khởi xướng dự án, dấn thân vào thử thách mới và bộc lộ quan điểm rõ ràng.', 'Sức sống mãnh liệt, năng lực lãnh đạo bẩm sinh, sự quyết đoán và khả năng truyền cảm hứng cho người khác.', 'Tính bốc đồng, dễ vội vã mà thiếu kế hoạch dài hạn, đôi khi trở nên nóng nảy khi gặp chướng ngại.', '', '', ARRAY['Nhà 1', 'Aries'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Taurus', '', 'Bản ngã gắn liền với sự ổn định, an toàn vật chất và trải nghiệm giác quan. Cuộc sống là một khu vườn cần được vun trồng kiên nhẫn.', 'Bạn thể hiện phong thái điềm tĩnh, đáng tin cậy. Bạn thích sự ổn định, coi trọng chất lượng cuộc sống và cẩn trọng trước mọi thay đổi.', 'Sức bền bỉ, tính thực tế cao, cảm nhận thẩm mỹ tốt và khả năng hiện thực hóa ý tưởng thành kết quả cụ thể.', 'Sự bướng bỉnh, ngại thay đổi và dễ bám chấp vào sự an toàn vật chất.', '', '', ARRAY['Nhà 1', 'Taurus'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Gemini', '', 'Bản ngã được định hình bởi sự tò mò tri thức, giao tiếp và tính linh hoạt. Cuộc sống là chuỗi thông tin phong phú cần được khám phá.', 'Bạn nhanh trí, cởi mở và luôn chuyển động. Bạn sở hữu nhiều sở thích, thể hiện hình ảnh trẻ trung, linh hoạt và giàu tính giao lưu.', 'Khả năng thích ứng nhanh, tư duy sắc bén, giao tiếp khéo léo và xử lý đa nhiệm hiệu quả.', 'Dễ phân tán năng lượng, tính hay thay đổi, thiếu kiên nhẫn khi phải tập trung lâu dài vào một việc.', '', '', ARRAY['Nhà 1', 'Gemini'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Cancer', '', 'Bản ngã thấu cảm qua lăng kính cảm xúc, bản năng nuôi dưỡng và nhu cầu an toàn nội tâm sâu sắc.', 'Bạn mang vẻ ngoài dịu dàng, chu đáo và đôi khi khép kín. Bạn nhạy cảm với năng lượng xung quanh và luôn bảo vệ những người thân yêu.', 'Trực giác nhạy bén, lòng thấu cảm sâu sắc, tính trung thành và khả năng tạo dựng cảm giác ấm áp.', 'Tâm trạng dễ thay đổi, dễ bị tổn thương và xu hướng thu mình vào vỏ bọc khi gặp áp lực.', '', '', ARRAY['Nhà 1', 'Cancer'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Leo', '', 'Bản ngã là sự tỏa sáng của tính sáng tạo, lòng tự hào và khát vọng bộc lộ cá tính kiêu hãnh.', 'Bạn có phong thái tự tin, ấm áp và lôi cuốn. Bạn naturally thu hút sự chú ý và biết cách làm nổi bật sự hiện diện của mình.', 'Sự hào phóng, tinh thần lạc quan, sức hút cá nhân mạnh mẽ và khả năng truyền năng lượng tích cực.', 'Cái tôi lớn, nhu cầu được công nhận cao và đôi khi quá chú trọng vào hình ảnh bên ngoài.', '', '', ARRAY['Nhà 1', 'Leo'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Virgo', '', 'Bản ngã gắn liền với tinh thần trách nhiệm, sự phân tích tỉ mỉ và hướng tới sự chỉn chu hiệu quả.', 'Bạn thể hiện phong thái khiêm tốn, thực tế và quan sát tinh tế. Bạn chú trọng tới chi tiết và luôn muốn cải thiện mọi thứ tốt hơn.', 'Tư duy phân tích sắc bén, tính cẩn thận, đạo đức làm việc cao và tinh thần cống hiến.', 'Xu hướng quá cầu toàn, dễ tự khắt khe với bản thân và bận tâm quá mức tới những chi tiết nhỏ.', '', '', ARRAY['Nhà 1', 'Virgo'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Libra', '', 'Bản ngã tìm thấy sự hoàn thiện qua các mối quan hệ, sự hòa hợp và tinh thần công bằng.', 'Bạn lịch thiệp, duyên dáng và coi trọng sự cân bằng. Bạn luôn hướng tới sự hòa nhã và giữ hình ảnh chỉn chu, thanh lịch.', 'Khả năng ngoại giao khéo léo, gu thẩm mỹ tinh tế, tư duy công bằng và dễ tạo thiện cảm.', 'Sự do dự khi ra quyết định, né tránh xung đột và dễ thỏa hiệp nhu cầu cá nhân để vừa lòng người khác.', '', '', ARRAY['Nhà 1', 'Libra'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Scorpio', '', 'Bản ngã là nguồn năng lượng chuyển hóa sâu sắc, sự kiên cường và sức mạnh nội tâm bí ẩn.', 'Bạn tỏa ra sức hút bí ẩn, thâm trầm và quan sát tinh tế. Bạn ít khi bộc lộ hết bản thân nhưng cảm nhận rất rõ bản chất vấn đề.', 'Nghị lực sống phi thường, trực giác thấu thị, khả năng phục hồi sau khủng hoảng và sự trung thành.', 'Tính nghi ngờ, sự kiểm soát cảm xúc thái quá và khó buông bỏ những tổn thương quá khứ.', '', '', ARRAY['Nhà 1', 'Scorpio'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Sagittarius', '', 'Bản ngã là người tiên phong tìm kiếm tri thức, tầm nhìn tự do và những trải nghiệm rộng mở.', 'Bạn thẳng thắn, phóng khoáng và luôn tràn đầy nhiệt huyết. Bạn yêu thích tự do, khám phá thế giới và học hỏi lý tưởng mới.', 'Tầm nhìn xa trông rộng, tinh thần lạc quan, sự thẳng thắn chân thành và khả năng truyền cảm hứng.', 'Tính bốc đồng, đôi khi thiếu sự chuẩn bị kỹ lưỡng hoặc quá thẳng lời.', '', '', ARRAY['Nhà 1', 'Sagittarius'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Capricorn', '', 'Bản ngã được xây dựng trên sự kỷ luật, tinh thần trách nhiệm và mục tiêu đạt được sự trưởng thành vững chắc.', 'Bạn thể hiện phong thái chín chắn, nghiêm túc và thực tế. Bạn có cái nhìn dài hạn và kiên trì từng bước tiến về phía trước.', 'Tính kỷ luật thép, sự kiên trì, khả năng gánh vác trách nhiệm lớn và tư duy chiến lược.', 'Đôi khi quá nghiêm khắc với bản thân, dễ lo âu về tương lai và khó bộc lộ cảm xúc mềm mỏng.', '', '', ARRAY['Nhà 1', 'Capricorn'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Aquarius', '', 'Bản ngã mang tính độc đáo, tư duy tiến bộ và tinh thần đổi mới phi truyền thống.', 'Bạn độc lập, thân thiện nhưng giữ một khoảng cách khách quan. Bạn suy nghĩ vượt khung và không ngại khác biệt với số đông.', 'Tư duy đột phá, tinh thần nhân văn, sự sáng tạo độc đáo và khả năng nhìn nhận khách quan.', 'Sự bướng bỉnh trong lý tưởng, đôi khi xa cách cảm xúc cá nhân.', '', '', ARRAY['Nhà 1', 'Aquarius'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES
('vi', 'house_in_sign', '1', 'Pisces', '', 'Bản ngã mềm mại, hòa quyện với dòng chảy cảm xúc, tâm linh và sự thấu cảm bao la.', 'Bạn giàu trí tưởng tượng, dịu dàng và nhạy cảm. Bạn dễ dàng cảm nhận năng lượng của môi trường xung quanh.', 'Lòng vị tha, khả năng cảm thụ nghệ thuật, trực giác sâu sắc và tinh thần chữa lành.', 'Dễ bị ảnh hưởng bởi cảm xúc tiêu cực của người khác, đôi khi thiếu ranh giới cá nhân rõ ràng.', '', '', ARRAY['Nhà 1', 'Pisces'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;

-- 2. Update remaining house_in_sign for language = 'vi' to clean Vietnamese template text if English exists
UPDATE placement_interpretations
SET core_meaning = 'Ý nghĩa vị trí đỉnh nhà phản ánh cách năng lượng cung hoàng đạo thể hiện trong lĩnh vực cuộc sống tương ứng.',
    real_life = 'Trong thực tế, vị trí này định hình phản ứng tự nhiên và trải nghiệm thực tế của bạn.',
    strengths = 'Mang lại nguồn năng lượng độc đáo và điểm tựa vững chắc để phát triển bản thân.',
    challenges = 'Yêu cầu sự nhận thức và rèn luyện kiên nhẫn để làm chủ bài học chiêm tinh.'
WHERE language = 'vi' AND factor_type = 'house_in_sign' AND (core_meaning ~ '^[A-Za-z0-9 ,.''-]+$' OR core_meaning = '');

-- 3. Copy any missing Vietnamese interpretation_templates to placement_interpretations
INSERT INTO placement_interpretations (
    language, factor_type, factor_value_1, factor_value_2, factor_value_3,
    core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
)
SELECT 
    t.language, t.factor_type, t.factor_value_1, t.factor_value_2, COALESCE(t.factor_value_3, ''),
    t.content, '', '', '', '', '', t.keywords
FROM interpretation_templates t
WHERE t.language = 'vi'
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET 
    core_meaning = EXCLUDED.core_meaning,
    key_themes = EXCLUDED.key_themes
WHERE placement_interpretations.core_meaning ~ '^[A-Za-z0-9 ,.''-]+$' OR placement_interpretations.core_meaning = '';
