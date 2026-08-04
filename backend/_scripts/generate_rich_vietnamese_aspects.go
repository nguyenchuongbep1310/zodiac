package main

import (
	"fmt"
	"os"
	"sort"
	"strings"
)

type AspectQuality struct {
	ViTitle     string
	CorePattern string
	RealPattern string
	StrPattern  string
	ChalPattern string
}

var planetMap = map[string]struct {
	ViName  string
	Concept string
}{
	"Sun":        {"Mặt Trời", "ý chí cá nhân, bản ngã và khát vọng tỏa sáng"},
	"Moon":       {"Mặt Trăng", "thế giới nội tâm, cảm xúc và bản năng nuôi dưỡng"},
	"Mercury":    {"Sao Thủy", "tư duy, giao tiếp và khả năng xử lý thông tin"},
	"Venus":      {"Sao Kim", "tình yêu, cảm xúc lãng mạn và giá trị thẩm mỹ"},
	"Mars":       {"Sao Hỏa", "năng lượng hành động, lòng dũng cảm và ham muốn chinh phục"},
	"Jupiter":    {"Sao Mộc", "niềm tin, sự may mắn và khát vọng phát triển tri thức"},
	"Saturn":     {"Sao Thổ", "tính kỷ luật, tinh thần trách nhiệm và các giới hạn"},
	"Uranus":     {"Sao Thiên Vương", "tư duy đổi mới, tính độc lập và sự đột phá"},
	"Neptune":    {"Sao Hải Vương", "trực giác tâm linh, trí tưởng tượng và lòng vị tha"},
	"Pluto":      {"Sao Diêm Vương", "sức mạnh chuyển hóa, chiều sâu tâm lý và sự tái sinh"},
	"Ascendant":  {"Cung Mọc", "diện mạo, phong thái và cách tiếp cận thế giới"},
	"Midheaven":  {"Thiên Đỉnh", "sự nghiệp, danh tiếng và mục tiêu cuộc đời"},
	"Chiron":     {"Chiron", "vết thương tâm hồn và năng lực chữa lành"},
	"North Node": {"La Hầu", "mục tiêu tiến hóa và con đường phát triển tâm hồn"},
}

var aspectQualities = map[string]AspectQuality{
	"conjunction": {
		ViTitle:     "Trùng Hợp",
		CorePattern: "Góc trùng hợp mang lại sự hợp nhất mãnh liệt giữa %s (%s) và %s (%s). Hai nguồn năng lượng hòa cùng một nhịp, định hình một nét cá tính nổi bật và nhất quán.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn thể hiện sự gắn kết tự nhiên giữa %s và %s. Mọi phản ứng diễn ra trực tiếp, bộc phát theo bản năng thống nhất của cả hai hành tinh.",
		StrPattern:  "Sự tập trung năng lượng cao, tinh thần nhất quán nội tâm và khả năng bộc lộ cá tính ấn tượng.",
		ChalPattern: "Đôi khi khó tách bạch các góc nhìn khác nhau. Dễ bị cuốn vào sự chủ quan khi hai nguồn năng lượng quá hòa nhập.",
	},
	"sextile": {
		ViTitle:     "Lục Hợp",
		CorePattern: "Góc lục hợp tạo cơ hội thuận lợi và sự hỗ trợ nhịp nhàng giữa %s (%s) và %s (%s). Năng lượng tuôn chảy nhẹ nhàng, kích thích tiềm năng phát triển.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn dễ dàng kết hợp %s với %s để gặt hái kết quả tích cực và nắm bắt cơ hội một cách hiệu quả.",
		StrPattern:  "Sự linh hoạt trong tư duy, kỹ năng kết nối tốt và tinh thần chủ động học hỏi, thích ứng nhanh.",
		ChalPattern: "Nếu không tự giác đặt ra thách thức và hành động, các cơ hội thuận lợi có thể bị trôi qua một cách thụ động.",
	},
	"trine": {
		ViTitle:     "Tam Hợp",
		CorePattern: "Góc tam hợp mang lại dòng chảy hài hòa và sự may mắn tự nhiên giữa %s (%s) và %s (%s). Hai hành tinh bổ trợ cho nhau một cách hoàn hảo.",
		RealPattern: "Trong cuộc sống hàng ngày, sự kết hợp giữa %s và %s diễn ra vô cùng tự nhiên, không gặp phải sự gượng ép hay trở ngại đáng kể.",
		StrPattern:  "Tài năng bẩm sinh, sự an ổn trong tâm hồn, sức hút tự nhiên và khả năng gặt hái thành công trôi chảy.",
		ChalPattern: "Có nguy cơ sinh ra tâm lý tự mãn hoặc thiếu động lực bứt phá khi đối mặt với những thử thách thực sự lớn.",
	},
	"square": {
		ViTitle:     "Vuông Góc",
		CorePattern: "Góc vuông góc tạo ra sự căng thẳng và thử thách nội tâm giữa %s (%s) và %s (%s). Đây là động lực áp lực thúc đẩy sự trưởng thành vượt bậc.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn thường xuyên cảm thấy sự giằng xé giữa đòi hỏi về %s và nhu cầu về %s.",
		StrPattern:  "Ý chí kiên cường, bản lĩnh vượt khó phi thường và khả năng chuyển hóa áp lực xung đột thành sức mạnh bứt phá.",
		ChalPattern: "Dễ rơi vào trạng thái căng thẳng thần kinh hoặc bực bội nội tâm khi chưa học được cách dung hòa hai năng lượng.",
	},
	"opposition": {
		ViTitle:     "Xung Chiếu",
		CorePattern: "Góc xung chiếu tạo sự đối lập và đòi hỏi sự cân bằng giữa %s (%s) và %s (%s). Hai mặt của một trục năng lượng cần được dung hòa hài hòa.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn hay thấy mình đứng giữa hai cực: một bên là %s và bên kia là %s, thường phản chiếu qua các mối quan hệ.",
		StrPattern:  "Tầm nhìn khách quan đa chiều, khả năng thấu hiểu tâm lý đối phương và năng lực đàm phán, hòa giải tuyệt vời khi đã trưởng thành.",
		ChalPattern: "Cảm giác dao động mâu thuẫn giữa nhu cầu cá nhân và kỳ vọng từ người khác trước khi đạt được sự cân bằng.",
	},
	"semi-sextile": {
		ViTitle:     "Bán Lục Hợp",
		CorePattern: "Góc bán lục hợp mang đến sự tương tác tinh tế giữa %s (%s) và %s (%s). Hai năng lượng kề nhau thúc đẩy sự tinh chỉnh vi mô liên tục.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn nhận thấy những góc nhìn khác biệt nhỏ giữa %s và %s, đòi hỏi sự linh hoạt điều chỉnh trong ứng xử.",
		StrPattern:  "Khả năng quan sát tinh tế, sự nhạy cảm với các chi tiết nhỏ và năng lực thích ứng linh hoạt.",
		ChalPattern: "Cảm giác lấn cấn nhỏ dai dẳng nếu không chú ý lắng nghe và đáp ứng các nhu cầu vi mô của bản thân.",
	},
	"quincunx": {
		ViTitle:     "Bất Bất Hợp",
		CorePattern: "Góc bất bất hợp (150°) đòi hỏi sự tái điều chỉnh liên tục giữa %s (%s) và %s (%s). Hai nguồn năng lượng không có điểm chung tự nhiên.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn cần chủ động sắp xếp để %s không làm gián đoạn hoặc gây mâu thuẫn với %s.",
		StrPattern:  "Khả năng giải quyết vấn đề tháo vát, tinh thần linh hoạt và năng lực thích nghi với các tình huống bất ngờ.",
		ChalPattern: "Dễ bị mệt mỏi tinh thần hoặc căng thẳng sức khỏe nhẹ do phải liên tục điều chỉnh nhịp sống.",
	},
}

func main() {
	planets := []string{"Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"}
	aspects := []string{"conjunction", "sextile", "trine", "square", "opposition", "semi-sextile", "quincunx"}

	var allStatements []string

	for i := 0; i < len(planets); i++ {
		for j := i + 1; j < len(planets); j++ {
			p1 := planets[i]
			p2 := planets[j]

			pair := []string{p1, p2}
			sort.Strings(pair)
			p1Sorted := pair[0]
			p2Sorted := pair[1]

			info1 := planetMap[p1Sorted]
			info2 := planetMap[p2Sorted]

			for _, asp := range aspects {
				q := aspectQualities[asp]

				core := fmt.Sprintf(q.CorePattern, info1.ViName, info1.Concept, info2.ViName, info2.Concept)
				real := fmt.Sprintf(q.RealPattern, info1.Concept, info2.Concept)
				str := fmt.Sprintf("%s (%s - %s)", q.StrPattern, info1.ViName, info2.ViName)
				chal := fmt.Sprintf("%s (%s - %s)", q.ChalPattern, info1.ViName, info2.ViName)

				coreEsc := strings.ReplaceAll(core, "'", "''")
				realEsc := strings.ReplaceAll(real, "'", "''")
				strEsc := strings.ReplaceAll(str, "'", "''")
				chalEsc := strings.ReplaceAll(chal, "'", "''")

				sql := fmt.Sprintf(
					"INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes) "+
						"VALUES ('vi', 'aspect', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '', '', ARRAY['Góc chiếu %s', '%s', '%s']) "+
						"ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3) "+
						"DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, key_themes = EXCLUDED.key_themes;",
					p1Sorted, p2Sorted, asp, coreEsc, realEsc, strEsc, chalEsc, q.ViTitle, info1.ViName, info2.ViName,
				)
				allStatements = append(allStatements, sql)
			}
		}
	}

	// Split into 4 smaller files
	total := len(allStatements)
	chunkSize := (total + 3) / 4

	for part := 1; part <= 4; part++ {
		start := (part - 1) * chunkSize
		end := start + chunkSize
		if end > total {
			end = total
		}
		if start >= total {
			break
		}

		chunk := allStatements[start:end]
		header := fmt.Sprintf("-- ENHANCED VIETNAMESE ASPECT INTERPRETATIONS (PART %d of 4)\n\n", part)
		fileContent := header + strings.Join(chunk, "\n\n")

		fileName := fmt.Sprintf("fix_vi_aspects_part%d.sql", part)
		err := os.WriteFile(fileName, []byte(fileContent), 0644)
		if err != nil {
			fmt.Printf("Error writing %s: %v\n", fileName, err)
			return
		}
		fmt.Printf("Wrote %s (%d statements)\n", fileName, len(chunk))
	}
}
