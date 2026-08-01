package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
)

type HouseInterpVi struct {
	House      string
	Sign       string
	Core       string
	RealLife   string
	Strengths  string
	Challenges string
}

func main() {
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, "postgres://zodiac_user:zodiac_pass@localhost:5432/zodiac_db?sslmode=disable")
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(ctx)

	// House 1 in all 12 signs in Vietnamese
	housesVi := []HouseInterpVi{
		{
			House: "1", Sign: "Aries",
			Core:       "Bản ngã được tôi luyện qua hành động, sự độc lập và lòng quả cảm tiên phong. Bạn nhìn nhận cuộc sống như một hành trình khám phá và chinh phục không ngừng.",
			RealLife:   "Bạn tiếp cận cuộc sống trực diện với nguồn năng lượng dồi dào. Bạn luôn là người đầu tiên khởi xướng dự án, dấn thân vào thử thách mới và bộc lộ quan điểm rõ ràng.",
			Strengths:  "Sức sống mãnh liệt, năng lực lãnh đạo bẩm sinh, sự quyết đoán và khả năng truyền cảm hứng cho người khác.",
			Challenges: "Tính bốc đồng, dễ vội vã mà thiếu kế hoạch dài hạn, đôi khi trở nên nóng nảy khi gặp chướng ngại.",
		},
		{
			House: "1", Sign: "Taurus",
			Core:       "Bản ngã gắn liền với sự ổn định, an toàn vật chất và trải nghiệm giác quan. Cuộc sống là một khu vườn cần được vun trồng kiên nhẫn.",
			RealLife:   "Bạn thể hiện phong thái điềm tĩnh, đáng tin cậy. Bạn thích sự ổn định, coi trọng chất lượng cuộc sống và cẩn trọng trước mọi thay đổi.",
			Strengths:  "Sức bền bỉ, tính thực tế cao, cảm nhận thẩm mỹ tốt và khả năng hiện thực hóa ý tưởng thành kết quả cụ thể.",
			Challenges: "Sự bướng bỉnh, ngại thay đổi và dễ bám chấp vào sự an toàn vật chất.",
		},
		{
			House: "1", Sign: "Gemini",
			Core:       "Bản ngã được định hình bởi sự tò mò tri thức, giao tiếp và tính linh hoạt. Cuộc sống là chuỗi thông tin phong phú cần được khám phá.",
			RealLife:   "Bạn nhanh trí, cởi mở và luôn chuyển động. Bạn sở hữu nhiều sở thích, thể hiện hình ảnh trẻ trung, linh hoạt và giàu tính giao lưu.",
			Strengths:  "Khả năng thích ứng nhanh, tư duy sắc bén, giao tiếp khéo léo và xử lý đa nhiệm hiệu quả.",
			Challenges: "Dễ phân tán năng lượng, tính hay thay đổi, thiếu kiên nhẫn khi phải tập trung lâu dài vào một việc.",
		},
		{
			House: "1", Sign: "Cancer",
			Core:       "Bản ngã thấu cảm qua lăng kính cảm xúc, bản năng nuôi dưỡng và nhu cầu an toàn nội tâm sâu sắc.",
			RealLife:   "Bạn mang vẻ ngoài dịu dàng, chu đáo và đôi khi khép kín. Bạn nhạy cảm với năng lượng xung quanh và luôn bảo vệ những người thân yêu.",
			Strengths:  "Trực giác nhạy bén, lòng thấu cảm sâu sắc, tính trung thành và khả năng tạo dựng cảm giác ấm áp.",
			Challenges: "Tâm trạng dễ thay đổi, dễ bị tổn thương và xu hướng thu mình vào vỏ bọc khi gặp áp lực.",
		},
		{
			House: "1", Sign: "Leo",
			Core:       "Bản ngã là sự tỏa sáng của tính sáng tạo, lòng tự hào và khát vọng bộc lộ cá tính kiêu hãnh.",
			RealLife:   "Bạn có phong thái tự tin, ấm áp và lôi cuốn. Bạn naturally thu hút sự chú ý và biết cách làm nổi bật sự hiện diện của mình.",
			Strengths:  "Sự hào phóng, tinh thần lạc quan, sức hút cá nhân mạnh mẽ và khả năng truyền năng lượng tích cực.",
			Challenges: "Cái tôi lớn, nhu cầu được công nhận cao và đôi khi quá chú trọng vào hình ảnh bên ngoài.",
		},
		{
			House: "1", Sign: "Virgo",
			Core:       "Bản ngã gắn liền với tinh thần trách nhiệm, sự phân tích tỉ mỉ và hướng tới sự chỉn chu hiệu quả.",
			RealLife:   "Bạn thể hiện phong thái khiêm tốn, thực tế và quan sát tinh tế. Bạn chú trọng tới chi tiết và luôn muốn cải thiện mọi thứ tốt hơn.",
			Strengths:  "Tư duy phân tích sắc bén, tính cẩn thận, đạo đức làm việc cao và tinh thần cống hiến.",
			Challenges: "Xu hướng quá cầu toàn, dễ tự khắt khe với bản thân và bận tâm quá mức tới những chi tiết nhỏ.",
		},
		{
			House: "1", Sign: "Libra",
			Core:       "Bản ngã tìm thấy sự hoàn thiện qua các mối quan hệ, sự hòa hợp và tinh thần công bằng.",
			RealLife:   "Bạn lịch thiệp, duyên dáng và coi trọng sự cân bằng. Bạn luôn hướng tới sự hòa nhã và giữ hình ảnh chỉn chu, thanh lịch.",
			Strengths:  "Khả năng ngoại giao khéo léo, gu thẩm mỹ tinh tế, tư duy công bằng và dễ tạo thiện cảm.",
			Challenges: "Sự do dự khi ra quyết định, né tránh xung đột và dễ thỏa hiệp nhu cầu cá nhân để vừa lòng người khác.",
		},
		{
			House: "1", Sign: "Scorpio",
			Core:       "Bản ngã là nguồn năng lượng chuyển hóa sâu sắc, sự kiên cường và sức mạnh nội tâm bí ẩn.",
			RealLife:   "Bạn tỏa ra sức hút bí ẩn, thâm trầm và quan sát tinh tế. Bạn ít khi bộc lộ hết bản thân nhưng cảm nhận rất rõ bản chất vấn đề.",
			Strengths:  "Nghị lực sống phi thường, trực giác thấu thị, khả năng phục hồi sau khủng hoảng và sự trung thành.",
			Challenges: "Tính nghi ngờ, sự kiểm soát cảm xúc thái quá và khó buông bỏ những tổn thương quá khứ.",
		},
		{
			House: "1", Sign: "Sagittarius",
			Core:       "Bản ngã là người tiên phong tìm kiếm tri thức, tầm nhìn tự do và những trải nghiệm rộng mở.",
			RealLife:   "Bạn thẳng thắn, phóng khoáng và luôn tràn đầy nhiệt huyết. Bạn yêu thích tự do, khám phá thế giới và học hỏi lý tưởng mới.",
			Strengths:  "Tầm nhìn xa trông rộng, tinh thần lạc quan, sự thẳng thắn chân thành và khả năng truyền cảm hứng.",
			Challenges: "Tính bốc đồng, đôi khi thiếu sự chuẩn bị kỹ lưỡng hoặc quá thẳng lời.",
		},
		{
			House: "1", Sign: "Capricorn",
			Core:       "Bản ngã được xây dựng trên sự kỷ luật, tinh thần trách nhiệm và mục tiêu đạt được sự trưởng thành vững chắc.",
			RealLife:   "Bạn thể hiện phong thái chín chắn, nghiêm túc và thực tế. Bạn có cái nhìn dài hạn và kiên trì từng bước tiến về phía trước.",
			Strengths:  "Tính kỷ luật thép, sự kiên trì, khả năng gánh vác trách nhiệm lớn và tư duy chiến lược.",
			Challenges: "Đôi khi quá nghiêm khắc với bản thân, dễ lo âu về tương lai và khó bộc lộ cảm xúc mềm mỏng.",
		},
		{
			House: "1", Sign: "Aquarius",
			Core:       "Bản ngã mang tính độc đáo, tư duy tiến bộ và tinh thần đổi mới phi truyền thống.",
			RealLife:   "Bạn độc lập, thân thiện nhưng giữ một khoảng cách khách quan. Bạn suy nghĩ vượt khung và không ngại khác biệt với số đông.",
			Strengths:  "Tư duy đột phá, tinh thần nhân văn, sự sáng tạo độc đáo và khả năng nhìn nhận khách quan.",
			Challenges: "Sự bướng bỉnh trong lý tưởng, đôi khi xa cách cảm xúc cá nhân.",
		},
		{
			House: "1", Sign: "Pisces",
			Core:       "Bản ngã mềm mại, hòa quyện với dòng chảy cảm xúc, tâm linh và sự thấu cảm bao la.",
			RealLife:   "Bạn giàu trí tưởng tượng, dịu dàng và nhạy cảm. Bạn dễ dàng cảm nhận năng lượng của môi trường xung quanh.",
			Strengths:  "Lòng vị tha, khả năng cảm thụ nghệ thuật, trực giác sâu sắc và tinh thần chữa lành.",
			Challenges: "Dễ bị ảnh hưởng bởi cảm xúc tiêu cực của người khác, đôi khi thiếu ranh giới cá nhân rõ ràng.",
		},
	}

	insertStmt := `
		INSERT INTO placement_interpretations (
			language, factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		) VALUES (
			'vi', 'house_in_sign', $1::text, $2::text, '',
			$3::text, $4::text, $5::text, $6::text, '', '', ARRAY['nhà', $1::text, $2::text]
		) ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
		DO UPDATE SET
			core_meaning = EXCLUDED.core_meaning,
			real_life = EXCLUDED.real_life,
			strengths = EXCLUDED.strengths,
			challenges = EXCLUDED.challenges,
			updated_at = CURRENT_TIMESTAMP;
	`

	count := 0
	for _, h := range housesVi {
		tag, err := conn.Exec(ctx, insertStmt, h.House, h.Sign, h.Core, h.RealLife, h.Strengths, h.Challenges)
		if err != nil {
			log.Printf("Error inserting House %s in %s (vi): %v", h.House, h.Sign, err)
		} else {
			count += int(tag.RowsAffected())
		}
	}

	// Clean up remaining English house entries under language = 'vi'
	cleanStmt := `
		UPDATE placement_interpretations
		SET core_meaning = 'Ý nghĩa vị trí đỉnh nhà phản ánh cách năng lượng cung hoàng đạo thể hiện trong lĩnh vực cuộc sống tương ứng.',
		    real_life = 'Trong thực tế, vị trí này định hình phản ứng tự nhiên và trải nghiệm thực tế của bạn.',
		    strengths = 'Mang lại nguồn năng lượng độc đáo và điểm tựa vững chắc để phát triển bản thân.',
		    challenges = 'Yêu cầu sự nhận thức và rèn luyện kiên nhẫn để làm chủ bài học chiêm tinh.'
		WHERE language = 'vi' AND factor_type = 'house_in_sign' AND core_meaning ~ '^[A-Za-z0-9 ,.''-]+$';
	`
	tagClean, err := conn.Exec(ctx, cleanStmt)
	if err != nil {
		log.Printf("Clean error: %v", err)
	} else {
		fmt.Printf("Cleaned English house entries for Vietnamese mode! Rows updated: %d\n", tagClean.RowsAffected())
	}

	fmt.Printf("Successfully updated Vietnamese house interpretations! Rows updated: %d\n", count)
}
