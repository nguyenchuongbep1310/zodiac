-- ═══════════════════════════════════════════════════════════════════════════════
-- VIETNAMESE HOUSE_IN_SIGN INTERPRETATIONS — Full 144 entries (12 Houses × 12 Signs)
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════

-- ═══ NHÀ 1 — Bản Ngã, Diện Mạo, Cách Tiếp Cận Cuộc Sống ═══════════════════

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Aries', '',
'Bản ngã được tôi luyện qua hành động, sự độc lập và lòng quả cảm tiên phong. Cuộc sống là hành trình chinh phục không ngừng.',
'Bạn tiếp cận cuộc sống trực diện với nguồn năng lượng dồi dào. Bạn luôn là người đầu tiên khởi xướng dự án, dấn thân vào thử thách mới và bộc lộ quan điểm rõ ràng.',
'Sức sống mãnh liệt, năng lực lãnh đạo bẩm sinh, sự can đảm và khả năng truyền cảm hứng cho người khác bằng ý chí mạnh mẽ.',
'Tính bốc đồng, xu hướng vội vã mà thiếu kế hoạch dài hạn, và dễ nóng nảy khi gặp trở ngại.',
'Trong tình cảm, bạn tìm kiếm sự phấn khích và có thể áp đặt nếu không cẩn thận. Bạn cần một người bạn đời tôn trọng sự độc lập của bạn.',
'Học cách kiên nhẫn và trân trọng việc hoàn thành mọi thứ thay vì chỉ bắt đầu.',
ARRAY['Nhà 1', 'Bạch Dương'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Taurus', '',
'Bản ngã gắn liền với sự ổn định, an toàn vật chất và trải nghiệm giác quan. Cuộc sống là khu vườn cần được vun trồng kiên nhẫn.',
'Bạn thể hiện phong thái điềm tĩnh, đáng tin cậy. Bạn thích sự ổn định, coi trọng chất lượng cuộc sống và cẩn trọng trước mọi thay đổi.',
'Sức bền bỉ, tính thực tế cao, cảm nhận thẩm mỹ tinh tế và khả năng hiện thực hóa ý tưởng thành kết quả cụ thể.',
'Sự bướng bỉnh, ngại thay đổi khi cần thiết và dễ bám chấp vào sự an toàn vật chất.',
'Bạn trung thành tuyệt đối và tìm kiếm sự bền vững lâu dài trong các mối quan hệ. Bạn mang đến sự thoải mái nhưng có thể sở hữu thái quá.',
'Đón nhận sự linh hoạt và hiểu rằng sự an toàn thực sự đến từ bên trong, không chỉ từ thế giới vật chất.',
ARRAY['Nhà 1', 'Kim Ngưu'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Gemini', '',
'Bản ngã được định hình bởi sự tò mò tri thức, giao tiếp và tính linh hoạt. Cuộc sống là dòng thông tin bất tận cần được khám phá.',
'Bạn nhanh trí, cởi mở và luôn chuyển động. Bạn sở hữu nhiều sở thích đa dạng, thể hiện hình ảnh trẻ trung và giàu tính giao tiếp.',
'Khả năng thích ứng nhanh, tư duy sắc bén, giao tiếp khéo léo và xử lý đa nhiệm hiệu quả.',
'Dễ phân tán năng lượng, tính hay thay đổi, thiếu kiên nhẫn khi phải tập trung lâu dài và dễ rơi vào sự hời hợt.',
'Bạn cần sự kích thích trí tuệ trong tình cảm. Sự nhàm chán là kẻ thù lớn nhất, và bạn cần một người bạn đời đồng thời là tri kỷ.',
'Phát triển sự tập trung và chiều sâu. Học cách cam kết theo đuổi một con đường khi cần thay vì phân tán năng lượng.',
ARRAY['Nhà 1', 'Song Tử'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Cancer', '',
'Bản ngã thấu cảm qua lăng kính cảm xúc, trực giác và nhu cầu an toàn nội tâm sâu sắc.',
'Bạn mang vẻ ngoài dịu dàng, chu đáo và đôi khi khép kín. Bạn nhạy cảm với tâm trạng người khác và bảo vệ người thân yêu rất mãnh liệt.',
'Trực giác nhạy bén, lòng thấu cảm sâu sắc, tính trung thành và khả năng tạo dựng cảm giác ấm áp như gia đình.',
'Tâm trạng thất thường, bám víu quá khứ, dễ thu mình vào vỏ bọc khi bị tổn thương và dễ cá nhân hóa mọi vấn đề.',
'Bạn tìm kiếm sự gắn kết cảm xúc sâu sắc và lo sợ bị bỏ rơi. Bạn chăm sóc đối phương nhưng có thể trở nên phụ thuộc.',
'Học cách phân tách cảm xúc khỏi thực tế khách quan. Thiết lập ranh giới lành mạnh để không bị hao mòn năng lượng.',
ARRAY['Nhà 1', 'Cự Giải'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Leo', '',
'Bản ngã là sự tỏa sáng của tính sáng tạo, lòng tự hào và khát vọng bộc lộ cá tính rực rỡ. Cuộc sống là sân khấu và bạn là ngôi sao.',
'Bạn có phong thái tự tin, ấm áp và lôi cuốn. Bạn hào phóng, tự nhiên thu hút sự chú ý và biết cách tạo ấn tượng khi xuất hiện.',
'Sức hút cá nhân mạnh mẽ, năng lực lãnh đạo bẩm sinh, trái tim rộng mở và khả năng truyền cảm hứng, nâng đỡ tinh thần người khác.',
'Cái tôi lớn, nhu cầu được công nhận quá cao, sự phù phiếm và xu hướng che khuất người khác.',
'Bạn trung thành tuyệt đối và hào phóng trong tình yêu, tìm kiếm người bạn đời ngưỡng mộ bạn và bạn có thể tự hào giới thiệu.',
'Sự tự tin thực sự không cần sự tán thưởng liên tục. Học cách tự xác nhận giá trị bản thân và chia sẻ ánh đèn sân khấu.',
ARRAY['Nhà 1', 'Sư Tử'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Virgo', '',
'Bản ngã gắn liền với tinh thần trách nhiệm, phân tích tỉ mỉ và hướng tới sự hoàn hảo. Cuộc sống là câu đố cần được giải quyết và cải thiện.',
'Bạn thể hiện phong thái khiêm tốn, thực tế và quan sát tinh tế. Bạn thường là người sửa chữa vấn đề và chú ý đến những chi tiết mà người khác bỏ sót.',
'Tư duy phân tích sắc bén, sự chú ý tỉ mỉ đến chi tiết, đạo đức làm việc cao và mong muốn chân thành phục vụ người khác.',
'Chủ nghĩa cầu toàn, tự phê bình nghiêm khắc, lo lắng thái quá về những chi tiết nhỏ và khắt khe với người khác.',
'Bạn thể hiện tình yêu qua hành động phục vụ. Bạn kỹ tính trong việc chọn bạn đời, tìm kiếm người đáp ứng tiêu chuẩn cao của mình.',
'Học cách chấp nhận sự không hoàn hảo của bản thân và người khác. Nuôi dưỡng lòng tự thương và nhận ra rằng "đủ tốt" đôi khi chính là hoàn hảo.',
ARRAY['Nhà 1', 'Xử Nữ'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Libra', '',
'Bản ngã tìm thấy sự hoàn thiện qua các mối quan hệ, sự cân bằng và tinh thần công bằng. Cuộc sống là nghệ thuật đòi hỏi sự ngoại giao.',
'Bạn lịch thiệp, duyên dáng và coi trọng sự hòa hợp. Bạn luôn hướng tới sự hòa nhã và giữ hình ảnh thanh lịch, tinh tế.',
'Khả năng ngoại giao khéo léo, tinh thần công bằng, sức hút tự nhiên và năng lực nhìn nhận mọi khía cạnh của vấn đề.',
'Do dự khi ra quyết định, sợ đối đầu, phụ thuộc vào người khác và thỏa hiệp nhu cầu bản thân để làm hài lòng mọi người.',
'Các mối quan hệ là trung tâm bản sắc của bạn. Bạn tìm kiếm mối quan hệ hài hòa nhưng cần tránh đánh mất bản thân trong đối phương.',
'Xây dựng ý thức tự lập vững chắc. Hiểu rằng thiết lập ranh giới và giải quyết xung đột lành mạnh là điều cần thiết cho sự hòa hợp thực sự.',
ARRAY['Nhà 1', 'Thiên Bình'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Scorpio', '',
'Bản ngã là nguồn năng lượng chuyển hóa sâu sắc, sự kiên cường và sức mạnh nội tâm bí ẩn.',
'Bạn tỏa ra sức hút bí ẩn, thâm trầm và quan sát tinh tế. Bạn ít khi bộc lộ hết bản thân nhưng hiểu rõ dòng chảy tâm lý ẩn sâu của mọi tình huống.',
'Nghị lực sống phi thường, chiều sâu tâm lý, sự tập trung kiên định và khả năng sống sót, chuyển hóa qua mọi khủng hoảng.',
'Tính nghi ngờ, mong muốn kiểm soát mọi thứ, hay ghen tuông và bám víu những hận thù đã nên buông bỏ từ lâu.',
'Bạn tìm kiếm sự gắn kết tâm hồn tuyệt đối và lòng trung thành. Bạn bảo vệ mãnh liệt nhưng dễ rơi vào tranh giành quyền lực.',
'Học cách tin tưởng và buông bỏ nhu cầu kiểm soát. Sức mạnh thực sự đến từ sự dễ bị tổn thương và khả năng tha thứ.',
ARRAY['Nhà 1', 'Bọ Cạp'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Sagittarius', '',
'Bản ngã là nhà thám hiểm tìm kiếm chân lý, ý nghĩa và sự mở rộng. Cuộc sống là hành trình triết học vĩ đại và cuộc phiêu lưu.',
'Bạn lạc quan, nhiệt huyết và luôn hướng về tương lai. Bạn thẳng thắn, vui vẻ và yêu tự do mãnh liệt.',
'Tầm nhìn xa trông rộng, tinh thần lạc quan bất diệt, sự thẳng thắn chân thành và khả năng nhìn thấy bức tranh lớn, truyền cảm hứng cho người khác.',
'Tính liều lĩnh, thiếu khéo léo, trốn tránh trách nhiệm và xu hướng thuyết giáo thay vì lắng nghe.',
'Bạn cần người bạn đời chia sẻ tình yêu phiêu lưu và tôn trọng nhu cầu tự do của bạn. Sự kiểm soát sẽ khiến bạn rời xa.',
'Học cách cân bằng tầm nhìn lớn với chi tiết thực tế. Nuôi dưỡng sự khéo léo và nhận ra rằng cam kết không luôn đồng nghĩa với mất tự do.',
ARRAY['Nhà 1', 'Nhân Mã'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Capricorn', '',
'Bản ngã được xây dựng trên sự kỷ luật, tinh thần trách nhiệm và mục tiêu đạt thành tựu dài hạn. Cuộc sống là ngọn núi cần chinh phục bằng kỷ luật.',
'Bạn thể hiện phong thái chín chắn, nghiêm túc và thực tế. Bạn có cái nhìn dài hạn, hết sức thực dụng và kiên trì xây dựng danh tiếng vững chắc.',
'Tính kỷ luật thép, tư duy chiến lược, sức chịu đựng phi thường và khả năng gánh vác trách nhiệm lớn lao để đạt tới sự tinh thông.',
'Bi quan, cứng nhắc, ưu tiên công việc hơn sức khỏe cảm xúc và nỗi sợ thất bại có thể dẫn đến trầm cảm.',
'Bạn coi trọng tình cảm và tìm kiếm người bạn đời tham vọng, đáng tin cậy. Bạn thể hiện tình yêu qua sự bảo đảm an toàn hơn là bộc lộ cảm xúc.',
'Cho phép bản thân dễ bị tổn thương và nhớ tận hưởng hành trình, không chỉ đích đến. Nuôi dưỡng sự cân bằng công việc-cuộc sống.',
ARRAY['Nhà 1', 'Ma Kết'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Aquarius', '',
'Bản ngã mang tính độc đáo, tư duy tiến bộ và tinh thần đổi mới phi truyền thống. Cuộc sống là cuộc thí nghiệm xã hội cần được cách mạng.',
'Bạn độc lập, thân thiện nhưng giữ một khoảng cách khách quan. Bạn suy nghĩ vượt khuôn khổ và không ngại khác biệt với số đông.',
'Tư duy đột phá, trí tuệ tiến bộ xuất sắc, giá trị nhân văn mạnh mẽ và khả năng phá vỡ những quy tắc lỗi thời.',
'Sự nổi loạn cố chấp, lạnh lùng cảm xúc, tính khó lường và xu hướng xa lánh người khác bằng sự trái ngược thái quá.',
'Bạn cần sự kết nối trí tuệ sâu sắc và tự do tuyệt đối. Bạn đối xử với đối phương như người bạn thân nhất nhưng có thể gặp khó khăn với sự thân mật cảm xúc sâu.',
'Học cách kết nối ở cấp độ cảm xúc sâu sắc, không chỉ trí tuệ. Sự nổi loạn thực sự đôi khi đòi hỏi sự dễ bị tổn thương.',
ARRAY['Nhà 1', 'Bảo Bình'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '1', 'Pisces', '',
'Bản ngã mềm mại, hòa quyện với dòng chảy cảm xúc, tâm linh và sự thấu cảm bao la. Cuộc sống là hành trình tâm linh hòa tan mọi ranh giới.',
'Bạn giàu trí tưởng tượng, dịu dàng và nhạy cảm sâu sắc. Bạn dễ dàng hấp thụ năng lượng xung quanh và mang đến sự hiện diện đầy lòng trắc ẩn.',
'Lòng vị tha vô bờ bến, cảm hứng nghệ thuật, chiều sâu tâm linh và khả năng chữa lành, an ủi người khác.',
'Xu hướng trốn tránh thực tại, thiếu ranh giới cá nhân, tâm lý nạn nhân và dễ lạc vào ảo tưởng hoặc nghiện ngập để tránh sự khắc nghiệt.',
'Bạn tìm kiếm sự kết hợp tâm linh, siêu việt. Bạn lãng mạn vô cùng nhưng dễ chiếu ảo tưởng lý tưởng hóa lên đối phương.',
'Xây dựng ranh giới cá nhân vững chắc và bám trụ vào thực tại. Học cách phân biệt cảm xúc của chính mình với cảm xúc của người khác.',
ARRAY['Nhà 1', 'Song Ngư'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

-- ═══ NHÀ 2 — Giá Trị Bản Thân, Tài Chính, An Toàn Vật Chất ═══════════════

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Aries', '',
'Giá trị bản thân và tài chính được thúc đẩy bởi hành động, sự độc lập và lòng can đảm chấp nhận rủi ro. Tiền bạc là công cụ giải phóng.',
'Bạn chi tiêu bốc đồng và kiếm tiền rất tích cực. Bạn thích tạo thu nhập qua các hoạt động kinh doanh độc lập hơn là chờ đợi cơ hội từ người khác.',
'Khả năng tạo thu nhập nhanh chóng, tinh thần doanh nhân không sợ hãi và niềm tin mạnh mẽ vào năng lực tự cung tự cấp.',
'Bốc đồng tài chính, tiêu tiền nhanh như kiếm được và thiếu kế hoạch tài chính dài hạn.',
'Bạn đánh giá cao những người bạn đời tự chủ. Tranh cãi về tiền bạc thường bắt nguồn từ mong muốn kiểm soát hoàn toàn tài sản.',
'Học giá trị của sự kiên nhẫn trong vấn đề tài chính. Rèn thói quen tiết kiệm và suy nghĩ về an toàn dài hạn trước khi chi tiêu bốc đồng.',
ARRAY['Nhà 2', 'Bạch Dương'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Taurus', '',
'Giá trị bản thân gắn chặt với sự ổn định vật chất, tài sản và tiện nghi giác quan. Của cải được xây dựng từ từ, vững chắc và bền vững.',
'Bạn rất thực tế với tài chính, ưu tiên đầu tư an toàn lâu dài. Bạn thích mua sắm chất lượng cao, xa xỉ và bền theo thời gian.',
'Kỹ năng quản lý tài chính xuất sắc, khả năng tích lũy của cải bền vững và sự trân trọng sâu sắc đối với vẻ đẹp và sự thoải mái.',
'Chủ nghĩa vật chất cực đoan, nỗi sợ mất tài chính dẫn đến tích trữ và từ chối cứng nhắc những chiến lược tài chính mới.',
'Bạn tìm kiếm người bạn đời mang lại sự ổn định. Bạn thể hiện giá trị qua những món quà hữu hình và tạo dựng tổ ấm thoải mái.',
'Hiểu rằng giá trị thực sự của bạn không được định nghĩa bởi tài khoản ngân hàng. Học cách tách rời cảm xúc khỏi tài sản vật chất.',
ARRAY['Nhà 2', 'Kim Ngưu'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Gemini', '',
'Giá trị bản thân gắn liền với sự linh hoạt trí tuệ, kỹ năng giao tiếp và khả năng thích ứng. Thu nhập thường đến từ nhiều nguồn đa dạng.',
'Bạn xem tiền bạc là phương tiện trải nghiệm sự đa dạng. Bạn có thể làm hai công việc cùng lúc, giao dịch chứng khoán hoặc kiếm tiền qua viết lách, diễn thuyết.',
'Sự linh hoạt tài chính, khả năng kiếm tiền từ ý tưởng và thông tin nhanh chóng, và cách tiếp cận thông minh với ngân sách.',
'Chi tiêu phung phí cho thiết bị hay sách vở, tài chính không ổn định và xu hướng nhảy từ kế hoạch kiếm tiền này sang kế hoạch khác.',
'Bạn coi trọng người bạn đời biết trao đổi thẳng thắn về tài chính và kích thích trí tuệ. Tài chính chung cần đối thoại liên tục, rõ ràng.',
'Tập trung năng lượng tài chính vào một hoặc hai kênh vững chắc thay vì phân tán. Rèn kỷ luật tài chính.',
ARRAY['Nhà 2', 'Song Tử'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Cancer', '',
'Giá trị bản thân và an toàn vật chất gắn bó mật thiết với cảm xúc an toàn và gia đình. Tiền được tiết kiệm để bảo vệ người thân và tổ ấm.',
'Bạn tiết kiệm cẩn thận, thường dự phòng cho "ngày mưa gió." Mục tiêu tài chính thường xoay quanh mua nhà hoặc lo liệu cho gia đình.',
'Trực giác tài chính xuất sắc (đặc biệt bất động sản), tính tiết kiệm và bản năng bảo vệ tài sản mạnh mẽ.',
'Chi tiêu theo cảm xúc, tích trữ tài sản vì sợ thiếu hụt và để giá trị bản thân dao động theo số dư tài khoản.',
'An toàn tài chính là điều kiện tiên quyết cho sự thân mật cảm xúc. Bạn cần người bạn đời chia sẻ cách tiếp cận bảo thủ với tiền bạc và an ninh gia đình.',
'Học cách tách rời sức khỏe cảm xúc khỏi tình trạng tài chính. Tin tưởng rằng bạn có thể vượt qua ngay cả khi hoàn cảnh vật chất thay đổi.',
ARRAY['Nhà 2', 'Cự Giải'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Leo', '',
'Giá trị bản thân gắn liền với niềm tự hào, sáng tạo và mong muốn tỏa sáng. Tiền bạc được dùng để thể hiện địa vị, sự hào phóng và niềm vui sống.',
'Bạn chi tiêu hào phóng, thường trả tiền cho bạn bè. Bạn xem của cải là cách tận hưởng xa xỉ và đòi hỏi mức thu nhập phản ánh lòng tự trọng cao.',
'Sự hào phóng vô cùng, khả năng thu hút của cải qua tài năng sáng tạo và tư duy phong phú, đầy ắp.',
'Xa hoa, sống vượt khả năng để duy trì hình ảnh và để cái tôi chi phối quyết định tài chính.',
'Bạn thể hiện tình yêu qua những cử chỉ lớn lao, tốn kém. Bạn mong đợi đối phương trân trọng sự hào phóng và đối xử với bạn như hoàng gia.',
'Hiểu rằng giá trị nội tại không phụ thuộc vào vật phẩm xa xỉ hay sự phô trương. Tập lập kế hoạch tài chính khiêm tốn.',
ARRAY['Nhà 2', 'Sư Tử'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Virgo', '',
'Giá trị bản thân dựa trên năng lực, kỹ năng thực tế và sự chăm chỉ. Tài chính được quản lý với sự chú ý tỉ mỉ đến chi tiết và ngân sách.',
'Bạn rất có tổ chức với tiền bạc, hiếm khi chi tiêu phung phí. Bạn kiếm thu nhập qua kỹ năng chuyên môn, phục vụ và nỗ lực siêng năng.',
'Kỹ năng lập ngân sách tuyệt vời, tính thực tế tài chính, sự tháo vát và đạo đức làm việc mạnh mẽ đảm bảo thu nhập ổn định.',
'Lo lắng thái quá về tiền bạc, đánh giá thấp kỹ năng bản thân và tính tiết kiệm cực đoan.',
'Trong mối quan hệ, bạn thích thỏa thuận tài chính thực tế và ngân sách rõ ràng. Bạn coi trọng người bạn đời có trách nhiệm tài chính.',
'Nhận ra giá trị thực sự của bản thân và đừng ngại đòi hỏi mức đãi ngộ công bằng. Đôi khi chi tiền cho niềm vui cũng là điều ổn.',
ARRAY['Nhà 2', 'Xử Nữ'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Libra', '',
'Giá trị bản thân gắn liền với thẩm mỹ, sự hài hòa và các mối quan hệ xã hội. Thu nhập thường đến từ hợp tác, nghệ thuật hoặc ngoại giao.',
'Bạn thích chi tiền cho nghệ thuật, thời trang và tạo môi trường xinh đẹp. Bạn có thể gặp khó cân đối ngân sách do mong muốn xa xỉ.',
'Khả năng thu hút tiền bạc qua sức hút và kết nối xã hội, con mắt thẩm mỹ tuyệt vời cho giá trị và sự công bằng trong giao dịch tài chính.',
'Chi tiêu quá mức cho xa xỉ phẩm để giữ hình ảnh, do dự trong kế hoạch tài chính và phụ thuộc quá nhiều vào đối phương về tài chính.',
'Bạn xem tài chính chung là phần quan trọng của hôn nhân. Bạn cần đảm bảo không thỏa hiệp sự độc lập tài chính để giữ hòa khí.',
'Học cách cân đối sổ sách cũng giỏi như cân đối các mối quan hệ. Nuôi dưỡng sự độc lập tài chính và tránh phụ thuộc.',
ARRAY['Nhà 2', 'Thiên Bình'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Scorpio', '',
'Giá trị bản thân và tài sản là chủ đề mang tính mãnh liệt, chuyển hóa và kiểm soát. Của cải thường đến qua đầu tư, thừa kế hoặc tài sản chung.',
'Bạn bí mật về tài chính và sở hữu bản năng kinh doanh sắc bén. Bạn có thể xây dựng lại hoàn toàn tài sản từ con số 0 sau khủng hoảng.',
'Sức bật tài chính phi thường, tài năng quản lý tiền của người khác và khả năng phát hiện cơ hội tài chính ẩn giấu.',
'Vấn đề kiểm soát tài chính, sự chiếm hữu, nỗi sợ phá sản và dùng tiền bạc như công cụ quyền lực hoặc thao túng.',
'Sự tin tưởng là tối quan trọng khi chia sẻ tài chính. Bạn đòi hỏi minh bạch tài chính tuyệt đối từ đối phương nhưng có thể giấu tài sản riêng.',
'Buông bỏ nhu cầu kiểm soát ám ảnh từng đồng. Hiểu rằng an toàn thực sự đến từ sức bật nội tâm, không chỉ sự thống trị tài chính.',
ARRAY['Nhà 2', 'Bọ Cạp'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Sagittarius', '',
'Giá trị bản thân gắn liền với sự lạc quan, tri thức và tự do. Tiền bạc được xem như tấm vé trải nghiệm thế giới, du lịch và học hỏi.',
'Bạn là người chấp nhận rủi ro tài chính tự nhiên, thường tin rằng "vũ trụ sẽ lo liệu." Bạn chi tiêu thoải mái cho trải nghiệm hơn là vật chất.',
'Sự lạc quan dồi dào thường thu hút của cải, tài năng kiếm tiền qua giảng dạy hoặc xuất bản và sự buông bỏ lành mạnh khỏi lòng tham vật chất.',
'Cờ bạc tài chính liều lĩnh, ước lượng thu nhập tương lai quá cao, bỏ qua ngân sách và sống quá khả năng do lạc quan thuần túy.',
'Bạn cần người bạn đời không hạn chế chi tiêu cho du lịch và giáo dục. Bạn ghét những ràng buộc tài chính và sự ki bo.',
'Kết hợp sự lạc quan tài chính với kế hoạch thực tế. Học cách tiết kiệm cho tương lai trong khi vẫn tận hưởng hiện tại.',
ARRAY['Nhà 2', 'Nhân Mã'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Capricorn', '',
'Giá trị bản thân được xây dựng trên tham vọng, địa vị và sự tích lũy tài sản chậm rãi, kỷ luật. An toàn tài chính là nền tảng của sự tôn trọng.',
'Bạn rất kỷ luật với tiền bạc, xem nó như thước đo thành công. Bạn sẵn sàng làm việc lâu dài và vất vả để đạt ổn định tài chính và địa vị xã hội.',
'Kỷ luật tài chính xuất sắc, kế hoạch chiến lược dài hạn, sự kiên nhẫn trong đầu tư và khả năng xây dựng di sản lâu bền.',
'Tiết kiệm cực đoan đến mức keo kiệt, ưu tiên của cải hơn các mối quan hệ và nỗi sợ nghèo đói ăn sâu bám rễ.',
'Bạn tìm kiếm người bạn đời ổn định tài chính. Tình yêu và tiền bạc thường gắn liền với tham vọng chung và xây dựng cuộc sống an toàn, truyền thống.',
'Nhớ rằng tiền bạc là phương tiện, không phải mục đích. Cho phép bản thân tận hưởng thành quả lao động mà không cảm thấy tội lỗi.',
ARRAY['Nhà 2', 'Ma Kết'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Aquarius', '',
'Giá trị bản thân bắt nguồn từ sự cá tính, trí tuệ và lý tưởng nhân đạo. Tài chính được quản lý theo cách phi truyền thống, đôi khi thất thường.',
'Bạn có thể kiếm tiền qua công nghệ, khoa học hoặc các tổ chức tiến bộ. Bạn quan tâm ít đến xa xỉ vật chất mà nhiều hơn đến sự độc lập tài chính.',
'Cách kiếm tiền sáng tạo, sự buông bỏ tài chính giúp tránh lòng tham và sẵn sàng dùng của cải cho lợi ích cộng đồng.',
'Dòng thu nhập thất thường, biến động tài chính đột ngột và thái độ nổi loạn với phương pháp tiết kiệm, lập ngân sách truyền thống.',
'Bạn thích giữ tài chính riêng trong mối quan hệ. Bạn coi trọng người bạn đời tôn trọng quyền tự chủ tài chính và lựa chọn phi truyền thống.',
'Tích hợp một chút ổn định tài chính truyền thống vào cuộc sống phi truyền thống. Một ngân sách cơ bản có thể mang lại sự tự do bạn khao khát.',
ARRAY['Nhà 2', 'Bảo Bình'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '2', 'Pisces', '',
'Giá trị bản thân gắn liền với giá trị tâm linh, lòng trắc ẩn và cảm hứng nghệ thuật. Của cải vật chất thường được xem như ảo ảnh hoặc thứ yếu.',
'Bạn có mối quan hệ mơ hồ, đôi khi bối rối với tiền bạc. Bạn vô cùng hào phóng, thường cho tiền đi nhưng có thể gặp khó theo dõi chi tiêu.',
'Khả năng hiện thực hóa của cải qua nghệ thuật và trực giác, lòng hào phóng vô bờ và sự vắng mặt của chủ nghĩa vật chất hời hợt.',
'Lộn xộn tài chính, dễ bị lừa đảo hoặc lợi dụng tài chính và trốn tránh thực tế hóa đơn và ngân sách.',
'Bạn hoàn toàn vị tha trong tài chính chung, điều này có thể khiến đối phương lợi dụng. Bạn cần người bạn đời lo liệu được khía cạnh tài chính thực tế.',
'Bám trụ vào thực tế tài chính. Học cách đặt ranh giới với lòng hào phóng và phát triển kỹ năng quản lý tiền bạc cơ bản.',
ARRAY['Nhà 2', 'Song Ngư'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

-- ═══ NHÀ 3 — Tư Duy, Giao Tiếp, Học Hỏi ═══════════════════════════════════

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Aries', '',
'Tư duy năng động, nhanh nhạy và rất độc lập. Giao tiếp trực diện, tiên phong và đôi khi mang tính đối đầu.',
'Bạn nói thẳng, nói nhanh và đầy sức mạnh. Bạn học nhanh, thích thu thập thông tin tức thì và khởi xướng các cuộc thảo luận hoặc tranh luận.',
'Sự quyết đoán trong tư duy, khả năng truyền cảm hứng qua lời nói và cách tiếp cận quả cảm khi bày tỏ ý tưởng.',
'Thiếu kiên nhẫn với người suy nghĩ chậm, hay ngắt lời, tranh cãi chỉ để thắng và thiếu sự theo đuổi ý tưởng đến cùng.',
'Bạn tương tác với bạn bè và anh chị em qua những cuộc tranh luận sôi nổi. Bạn cần sự độc lập trí tuệ và dễ bực bội với người quá nhạy cảm trước lối nói thẳng.',
'Thực hành lắng nghe chủ động. Hiểu rằng giao tiếp là con đường hai chiều và dừng lại trước khi nói có thể tránh xung đột không cần thiết.',
ARRAY['Nhà 3', 'Bạch Dương'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Taurus', '',
'Tư duy thận trọng, thực tế và chịu ảnh hưởng mạnh bởi giác quan. Giao tiếp chậm rãi, vững chắc và được cân nhắc kỹ.',
'Bạn cần thời gian để xử lý thông tin và hình thành quan điểm. Khi đã quyết định, bạn vô cùng kiên định và diễn đạt suy nghĩ với sự rõ ràng thực tế.',
'Trí nhớ bền vững, khả năng chuyển hóa ý tưởng trừu tượng thành kế hoạch cụ thể và giọng nói đáng tin cậy, trấn an.',
'Bướng bỉnh trong tư duy, miễn cưỡng chấp nhận khái niệm mới hoặc trừu tượng và cố chấp quá mức với quan điểm.',
'Mối quan hệ với anh chị em hoặc hàng xóm thường ổn định, lâu bền. Bạn thể hiện sự quan tâm qua lời khuyên thực tế và sự đáng tin cậy.',
'Mở rộng tư duy cho những khái niệm không thể sờ nắm hay chứng minh ngay lập tức. Đón nhận sự linh hoạt trí tuệ.',
ARRAY['Nhà 3', 'Kim Ngưu'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Gemini', '',
'Tư duy cực nhanh, tò mò và đa năng. Giao tiếp là nguồn sống của cuộc sống thường nhật.',
'Bạn là người nói chuyện tự nhiên, liên tục hấp thụ và chia sẻ thông tin. Bạn có thể đọc nhiều sách cùng lúc và sở hữu mạng lưới quen biết rộng lớn.',
'Trí tuệ sắc sảo, khả năng thích ứng xuất sắc, tài năng viết lách và diễn thuyết cùng khả năng nắm bắt khái niệm phức tạp tức thì.',
'Bồn chồn trí tuệ, hời hợt, khoảng chú ý ngắn và xu hướng phân tán năng lượng trí tuệ quá nhiều hướng.',
'Bạn phát triển mạnh nhờ giao tiếp liên tục với anh chị em và hàng xóm. Bạn cần sự kích thích trí tuệ đa dạng để giữ cho các mối quan hệ thường nhật thú vị.',
'Học cách tập trung tư duy. Chiều sâu kiến thức cũng quan trọng như chiều rộng. Thực hành thiền để làm dịu bộ não hoạt động liên tục.',
ARRAY['Nhà 3', 'Song Tử'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Cancer', '',
'Tư duy chịu ảnh hưởng sâu sắc bởi cảm xúc, ký ức và trực giác. Giao tiếp đồng cảm, chủ quan và mang tính bảo vệ.',
'Bạn xử lý thông tin qua cảm nhận. Bạn có trí nhớ phi thường về quá khứ và giao tiếp với sự cộng hưởng cảm xúc sâu sắc.',
'Trực giác mạnh mẽ, khả năng đọc giữa các dòng chữ, diễn đạt giàu chất thơ và đôi tai thấu cảm sâu sắc dành cho người khác.',
'Để cảm xúc che mờ phán đoán logic, cá nhân hóa những phát biểu khách quan và xu hướng giao tiếp kiểu thụ động-hung hăng.',
'Bạn đối xử với bạn bè thân và hàng xóm như gia đình. Giao tiếp trong các mối quan hệ này mang tính nuôi dưỡng nhưng bạn dễ bị tổn thương bởi lời nói khắc nghiệt.',
'Học cách tách rời cảm xúc khỏi sự thật. Rèn luyện lý luận khách quan để cảm xúc không bóp méo nhận thức thực tế.',
ARRAY['Nhà 3', 'Cự Giải'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Leo', '',
'Tư duy sáng tạo, kiêu hãnh và biểu đạt đầy kịch tính. Giao tiếp được dùng để truyền cảm hứng, giải trí và giành sự công nhận.',
'Bạn nói với sự uy nghiêm và phong cách. Bạn là người kể chuyện bẩm sinh, biết cách cuốn hút khán giả và trình bày ý tưởng sáng tạo.',
'Giao tiếp cuốn hút, khả năng dẫn dắt và tạo động lực qua lời nói, trí tuệ ấm áp và giàu biểu cảm.',
'Kiêu ngạo trí tuệ, áp đảo cuộc trò chuyện, miễn cưỡng lắng nghe quan điểm đối lập và cần được khen ngợi liên tục cho ý tưởng.',
'Bạn tự hào về anh chị em và cộng đồng. Bạn mong đợi lòng trung thành và sự ngưỡng mộ trong tương tác hàng ngày và có thể bị tổn thương sâu sắc bởi chỉ trích trí tuệ.',
'Nhớ rằng một nhà lãnh đạo giỏi cũng biết lắng nghe. Cho phép người khác chia sẻ ánh đèn trong cuộc trò chuyện và chấp nhận phản hồi xây dựng.',
ARRAY['Nhà 3', 'Sư Tử'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Virgo', '',
'Tư duy phân tích, chú trọng chi tiết và mang tính phê phán cao. Giao tiếp chính xác, thực tế và tập trung vào giải quyết vấn đề.',
'Bạn phân tích thông tin tỉ mỉ và nhận ra chi tiết mà mọi người bỏ sót. Bạn giao tiếp rõ ràng, hướng tới sự chính xác và hữu ích.',
'Kỹ năng tổ chức xuất sắc, trí tuệ phân tích sắc bén, tài nghiên cứu và giao tiếp rõ ràng, hiệu quả.',
'Suy nghĩ quá nhiều, chìm đắm trong chi tiết nhỏ, tự phê bình cực đoan và xu hướng quá khắt khe hoặc bới lông tìm vết với người khác.',
'Bạn thể hiện sự quan tâm với anh chị em và bạn bè bằng sự giúp đỡ thực tế và giải quyết vấn đề. Bạn đòi hỏi logic và sự thật.',
'Học cách nhìn bức tranh toàn cảnh thay vì đau đáu với chi tiết. Thư giãn tư duy phê phán và nhận ra không phải mọi thứ đều cần phân tích.',
ARRAY['Nhà 3', 'Xử Nữ'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Libra', '',
'Tư duy ngoại giao, cân bằng và nghiêng về thẩm mỹ. Giao tiếp lịch sự, thuyết phục và nhằm tạo sự hài hòa.',
'Bạn cân nhắc kỹ mọi khía cạnh trước khi nói. Bạn là nhà hòa giải xuất sắc, dùng ngôn ngữ để xoa dịu xung đột và thu hút người khác.',
'Tài năng ngoại giao bẩm sinh, tính công bằng, cách nói chuyện tinh tế và khả năng nhìn nhận đa chiều đồng thời.',
'Do dự, đồng ý với người khác chỉ để giữ hòa khí, tránh đối đầu cần thiết và phụ thuộc trí tuệ vào đối phương.',
'Bạn tìm kiếm sự tương tác hài hòa, bình đẳng với anh chị em và hàng xóm. Bạn ghét giao tiếp thô lỗ và hướng tới các quan hệ đối tác trí tuệ.',
'Đừng ngại bày tỏ quan điểm không phổ biến. Sự chính trực trí tuệ thực sự đôi khi đòi hỏi phá vỡ sự bình yên để nói lên sự thật.',
ARRAY['Nhà 3', 'Thiên Bình'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Scorpio', '',
'Tư duy thấu thị, điều tra và mang chiều sâu tâm lý. Giao tiếp mãnh liệt, bí mật và thuyết phục mạnh mẽ.',
'Bạn không quan tâm chuyện phiếm; bạn muốn biết sự thật ẩn giấu. Bạn nghiên cứu ám ảnh và nói với cường độ khiến người khác phải chú ý.',
'Cái nhìn tâm lý sâu sắc, khả năng phát hiện bí mật, sự tập trung tuyệt đối và trí tuệ chuyển hóa mạnh mẽ.',
'Hoang tưởng, tâm trí ám ảnh, bám víu suy nghĩ tiêu cực và dùng ngôn ngữ để thao túng hoặc châm chích khi bị tổn thương.',
'Bạn bảo vệ mãnh liệt anh chị em và vòng tròn thân cận nhưng đòi hỏi lòng trung thành tuyệt đối. Bạn có thể nghi ngờ và giao tiếp với sự cảnh giác mãnh liệt.',
'Dùng tư duy thấu thị để chữa lành thay vì kiểm soát. Học cách tin tưởng người khác và nhận ra không phải ai cũng có động cơ ẩn giấu.',
ARRAY['Nhà 3', 'Bọ Cạp'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Sagittarius', '',
'Tư duy triết học, mở rộng và lạc quan. Giao tiếp thẳng thắn, nhiệt huyết và tập trung vào bức tranh lớn.',
'Bạn suy nghĩ theo khái niệm lớn và khả năng tương lai. Bạn thẳng thắn đến mức đôi khi gây phiền, thích thảo luận triết học hoặc du lịch.',
'Tư duy tầm nhìn, tình yêu học hỏi, sự lạc quan bất diệt và khả năng truyền cảm hứng cho người khác bằng góc nhìn rộng mở.',
'Bỏ qua chi tiết quan trọng, giáo điều, nói trước nghĩ sau và thiếu khéo léo cần thiết cho những cuộc trò chuyện nhạy cảm.',
'Bạn tương tác với bạn bè và anh chị em theo kiểu vui vẻ, yêu tự do. Bạn thích tranh luận triết học nhưng có thể vô tình xúc phạm người khác vì quá thẳng.',
'Học cách chú ý chi tiết và nuôi dưỡng sự khéo léo. Sự thẳng thắn là đức tính nhưng cần được truyền tải với sự đồng cảm để hiệu quả.',
ARRAY['Nhà 3', 'Nhân Mã'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Capricorn', '',
'Tư duy có cấu trúc, tham vọng và cực kỳ thực dụng. Giao tiếp mang tính uy quyền, thận trọng và tập trung vào kết quả.',
'Bạn cân nhắc kỹ lời nói và chỉ phát biểu khi có điều ý nghĩa. Bạn suy nghĩ theo chiến lược, hiệu quả và mục tiêu dài hạn.',
'Năng lực điều hành xuất sắc, khả năng hiện thực hóa ý tưởng, tư duy kỷ luật và giao tiếp rõ ràng, uy nghiêm.',
'Bi quan, cứng nhắc trí tuệ, xu hướng xem mọi thứ như giao dịch và sợ bày tỏ suy nghĩ dễ bị tổn thương.',
'Bạn đóng vai trò người có thẩm quyền với anh chị em và hàng xóm. Bạn giao tiếp với tinh thần trách nhiệm, coi trọng sự tôn trọng hơn sự ấm áp.',
'Cho phép bản thân suy nghĩ ngoài khuôn khổ cứng nhắc của bổn phận và tham vọng. Nuôi dưỡng khiếu hài hước và bày tỏ cảm xúc tự do hơn.',
ARRAY['Nhà 3', 'Ma Kết'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Aquarius', '',
'Tư duy sáng tạo, phi truyền thống và cực kỳ khách quan. Giao tiếp tiến bộ, lạnh lùng và thường đi trước thời đại.',
'Bạn xử lý thông tin một cách logic nhưng theo cách hoàn toàn độc đáo. Bạn thích thảo luận về ý tưởng tiến bộ, công nghệ và cải cách xã hội.',
'Sự độc đáo, trí tuệ sáng suốt và khách quan, lý tưởng nhân văn và khả năng nắm bắt các khái niệm phức tạp, trừu tượng dễ dàng.',
'Cảm giác thượng đẳng trí tuệ, lạnh lùng cảm xúc, cố chấp cực đoan về quan điểm độc đáo và giao tiếp mang tính nổi loạn.',
'Bạn xem anh chị em và cộng đồng địa phương là một phần của tập thể lớn hơn. Bạn giao tiếp như bạn bè nhưng có thể gặp khó với sự đồng cảm cảm xúc sâu.',
'Nhớ rằng trí tuệ chỉ là một phần trải nghiệm con người. Học cách tích hợp trí tuệ cảm xúc vào bộ não logic sáng chói của bạn.',
ARRAY['Nhà 3', 'Bảo Bình'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;

INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes)
VALUES ('vi', 'house_in_sign', '3', 'Pisces', '',
'Tư duy giàu trí tưởng tượng, thơ mộng và rất trực giác. Giao tiếp phi ngôn ngữ, thấu cảm và đôi khi mơ hồ.',
'Bạn suy nghĩ bằng hình ảnh và cảm xúc thay vì logic. Bạn hấp thụ thông tin qua thẩm thấu và giao tiếp qua nghệ thuật, âm nhạc hoặc tín hiệu cảm xúc tinh tế.',
'Trí tưởng tượng sâu sắc, cái nhìn tâm linh, khả năng giao tiếp với sự thấu cảm tuyệt đối và tài năng thơ ca.',
'Thiếu tập trung, rối loạn tư duy, xu hướng mơ mộng thay vì đối mặt thực tại và khó diễn đạt suy nghĩ rõ ràng.',
'Bạn chia sẻ mối liên kết tâm linh sâu sắc với anh chị em và bạn bè. Bạn vô cùng thấu cảm nhưng dễ bị choáng ngợp bởi tiếng ồn tinh thần của họ.',
'Bám trụ tư duy vào logic và thực tế. Tập diễn đạt thế giới nội tâm rộng lớn bằng ngôn ngữ rõ ràng, súc tích để tránh hiểu lầm.',
ARRAY['Nhà 3', 'Song Ngư'])
ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;
