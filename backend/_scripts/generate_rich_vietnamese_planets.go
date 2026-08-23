package main

import (
	"fmt"
	"os"
	"strings"
)

type PlanetInfo struct {
	EnName  string
	ViName  string
	Domain  string // e.g. "bản sắc cốt lõi, ý chí và sức sống"
	Action  string // e.g. "tỏa sáng và định hình cá tính"
}

var planets = []PlanetInfo{
	{"Sun", "Mặt Trời", "bản sắc cốt lõi, ý chí cá nhân và sức sống", "tỏa sáng và thể hiện cái tôi"},
	{"Moon", "Mặt Trăng", "thế giới nội tâm, cảm xúc và nhu cầu an toàn", "nuôi dưỡng cảm xúc và kết nối tâm hồn"},
	{"Mercury", "Sao Thủy", "tư duy logic, khả năng giao tiếp và xử lý thông tin", "suy nghĩ, học hỏi và diễn đạt ý tưởng"},
	{"Venus", "Sao Kim", "tình yêu, giá trị thẩm mỹ, tài chính và sự hòa hợp", "thu hút cái đẹp và xây dựng mối quan hệ"},
	{"Mars", "Sao Hỏa", "năng lượng hành động, quyết tâm và lòng dũng cảm", "dẫn đầu, chinh phục và vượt qua thử thách"},
	{"Jupiter", "Sao Mộc", "niềm tin, sự mở rộng tầm nhìn và vận may", "học hỏi tri thức lớn và mở rộng trải nghiệm"},
	{"Saturn", "Sao Thổ", "tính kỷ luật, tinh thần trách nhiệm và cấu trúc bền vững", "xây dựng di sản và chịu trách nhiệm dài hạn"},
	{"Uranus", "Sao Thiên Vương", "tư duy đổi mới, tính đột phá và tinh thần tự do", "tạo ra khác biệt và bứt phá khuôn mẫu"},
	{"Neptune", "Sao Hải Vương", "trực giác tâm linh, trí tưởng tượng và lòng vị tha", "kết nối với thế giới vô hình và cảm nhận nghệ thuật"},
	{"Pluto", "Sao Diêm Vương", "sức mạnh chuyển hóa, chiều sâu tâm lý và sự tái sinh", "đào sâu bản chất và tái sinh từ thử thách"},
}

type SignInfo struct {
	EnName  string
	ViName  string
	Style   string // e.g. "tự tin, bốc lửa và mang tinh thần tiên phong"
	Core    string // e.g. "sự quyết đoán và tốc độ"
}

var signs = []SignInfo{
	{"Aries", "Bạch Dương", "quyết đoán, bốc lửa và mang tinh thần tiên phong", "sự can đảm và tốc độ"},
	{"Taurus", "Kim Ngưu", "kiên định, thực tế và coi trọng sự ổn định bền vững", "sự kiên nhẫn và thấu cảm giác quan"},
	{"Gemini", "Song Tử", "linh hoạt, tò mò và giàu khả năng giao tiếp", "sự đa dạng và trí tuệ nhanh nhạy"},
	{"Cancer", "Cự Giải", "sâu sắc về cảm xúc, giàu bản năng nuôi dưỡng và gắn bó với cội nguồn", "sự thấu cảm và bảo vệ tổ ấm"},
	{"Leo", "Sư Tử", "rực rỡ, tự tin, giàu sáng tạo và khao khát tỏa sáng", "lòng hào phóng và khí chất lãnh đạo"},
	{"Virgo", "Xử Nữ", "tỉ mỉ, chu đáo, có tính phân tích cao và định hướng phục vụ", "sự hoàn thiện và tính thực tế"},
	{"Libra", "Thiên Bình", "hài hòa, thanh lịch, duyên dáng và coi trọng sự công bằng", "kỹ năng ngoại giao và cảm nhận thẩm mỹ"},
	{"Scorpio", "Bọ Cạp", "mãnh liệt, sâu sắc, bí ẩn và giàu sức mạnh chuyển hóa", "chiều sâu tâm lý và lòng trung thành tuyệt đối"},
	{"Sagittarius", "Nhân Mã", "lạc quan, yêu tự do, phóng khoáng và luôn tìm kiếm ý nghĩa triết học", "tầm nhìn rộng mở và tinh thần phiêu lưu"},
	{"Capricorn", "Ma Kết", "kỷ luật, có trách nhiệm, kiên trì và hướng tới thành tựu lâu dài", "bản lĩnh vững vàng và tư duy chiến lược"},
	{"Aquarius", "Bảo Bình", "độc đáo, tiến bộ, giàu lý tưởng nhân văn và hướng tới tương lai", "tư duy đổi mới và sự bình đẳng"},
	{"Pisces", "Song Ngư", "giàu lòng trắc ẩn, nhạy cảm tâm linh và tràn đầy trí tưởng tượng", "trực giác nhạy bén và sự vị tha vô bờ"},
}

type HouseInfo struct {
	Num     string
	ViName  string
	Domain  string // e.g. "bản thân, diện mạo và thái độ tiếp cận cuộc sống"
}

var houses = []HouseInfo{
	{"1", "Nhà 1 (Bản Thân & Phong Thái)", "bản thân, ngoại hình, diện mạo và cách tiếp cận thế giới xung quanh"},
	{"2", "Nhà 2 (Tài Chính & Giá Trị)", "tài chính cá nhân, tài sản, khả năng kiếm tiền và giá trị bản thân"},
	{"3", "Nhà 3 (Giao Tiếp & Học Hỏi)", "giao tiếp, kỹ năng tư duy, việc học ngắn hạn và mối quan hệ anh em bạn bè"},
	{"4", "Nhà 4 (Gia Đình & Cội Nguồn)", "gia đình, ngôi nhà, đời sống nội tâm và nền tảng cội nguồn"},
	{"5", "Nhà 5 (Sáng Tạo & Tình Yêu)", "sáng tạo nghệ thuật, tình yêu lãng mạn, niềm vui sống và con cái"},
	{"6", "Nhà 6 (Công Việc & Sức Khỏe)", "công việc hàng ngày, thói quen sinh hoạt, sức khỏe thể chất và sự phục vụ"},
	{"7", "Nhà 7 (Đối Tác & Hôn Nhân)", "quan hệ đối tác, hôn nhân, sự hợp tác kinh doanh và các mối quan hệ một-đối-một"},
	{"8", "Nhà 8 (Chuyển Hóa & Tài Sản Chung)", "tài sản chung, sự chuyển hóa tâm lý, chiều sâu cảm xúc và bí ẩn cuộc sống"},
	{"9", "Nhà 9 (Triết Học & Học Vấn Cao)", "học vấn cao, du lịch xa, triết lý sống và sự mở rộng tầm nhìn toàn cầu"},
	{"10", "Nhà 10 (Sự Nghiệp & Danh Tiếng)", "sự nghiệp, hình ảnh công chúng, mục tiêu lớn và vị thế xã hội"},
	{"11", "Nhà 11 (Bạn Bè & Cộng Đồng)", "mạng lưới bạn bè, nhóm cộng đồng, ước mơ tương lai và lý tưởng chung"},
	{"12", "Nhà 12 (Tiềm Thức & Tâm Linh)", "thế giới tiềm thức, đời sống tâm linh, sự chữa lành và những bí ẩn nội tâm"},
}

func main() {
	var sqls []string
	sqls = append(sqls, "-- ENHANCED VIETNAMESE PLANET INTERPRETATIONS (PLANET IN SIGN & PLANET IN HOUSE)\n")

	// 1. Generate Planet In Sign Statements
	for _, p := range planets {
		for _, s := range signs {
			core := fmt.Sprintf("%s đặt tại %s thể hiện %s theo phong cách %s. Bạn tìm kiếm %s trong mọi trải nghiệm.", p.ViName, s.ViName, p.Domain, s.Style, s.Core)
			real := fmt.Sprintf("Trong đời sống hàng ngày, bạn dùng %s để %s. Sự kết hợp này giúp bạn thể hiện nét cá tính độc đáo và có chiều sâu.", s.Style, p.Action)
			str := fmt.Sprintf("Phát huy tối đa năng lực %s khi kết hợp với %s.", p.Domain, s.Core)
			chal := fmt.Sprintf("Cần tránh việc quá cực đoan hoặc mất cân bằng khi thể hiện năng lượng %s qua lăng kính %s.", p.ViName, s.ViName)
			rel := fmt.Sprintf("Trong các mối quan hệ, bạn mang đến sự %s, thể hiện tình cảm qua %s.", s.Style, p.Domain)
			growth := fmt.Sprintf("Học cách dung hòa %s với các yếu tố khác để đạt được sự phát triển toàn diện.", s.Core)

			coreEsc := strings.ReplaceAll(core, "'", "''")
			realEsc := strings.ReplaceAll(real, "'", "''")
			strEsc := strings.ReplaceAll(str, "'", "''")
			chalEsc := strings.ReplaceAll(chal, "'", "''")
			relEsc := strings.ReplaceAll(rel, "'", "''")
			growthEsc := strings.ReplaceAll(growth, "'", "''")

			sql := fmt.Sprintf(
				"INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes) "+
					"VALUES ('vi', 'planet_in_sign', '%s', '%s', '', '%s', '%s', '%s', '%s', '%s', '%s', ARRAY['%s ở %s', '%s', '%s']) "+
					"ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3) "+
					"DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;",
				p.EnName, s.EnName, coreEsc, realEsc, strEsc, chalEsc, relEsc, growthEsc, p.ViName, s.ViName, p.ViName, s.ViName,
			)
			sqls = append(sqls, sql)
		}
	}

	// 2. Generate Planet In House Statements
	for _, p := range planets {
		for _, h := range houses {
			core := fmt.Sprintf("%s nằm ở %s tập trung năng lượng %s vào lĩnh vực %s. Đây là môi trường quan trọng nhất để bạn thể hiện bản thân.", p.ViName, h.ViName, p.Domain, h.Domain)
			real := fmt.Sprintf("Trong cuộc sống hàng ngày, bạn đầu tư rất nhiều thời gian và tâm huyết để %s tại %s.", p.Action, h.ViName)
			str := fmt.Sprintf("Khả năng phát huy mạnh mẽ năng lượng %s trong các vấn đề liên quan đến %s.", p.ViName, h.Domain)
			chal := fmt.Sprintf("Dễ dồn quá nhiều áp lực hoặc kỳ vọng vào %s, cần học cách cân bằng với các khía cạnh cuộc sống khác.", h.ViName)
			rel := fmt.Sprintf("Trong các mối quan hệ, bạn coi trọng sự chia sẻ và đồng hành trong lĩnh vực %s.", h.Domain)
			growth := fmt.Sprintf("Sử dụng %s làm bệ phóng để phát triển bản thân và đóng góp giá trị lâu dài.", h.ViName)

			coreEsc := strings.ReplaceAll(core, "'", "''")
			realEsc := strings.ReplaceAll(real, "'", "''")
			strEsc := strings.ReplaceAll(str, "'", "''")
			chalEsc := strings.ReplaceAll(chal, "'", "''")
			relEsc := strings.ReplaceAll(rel, "'", "''")
			growthEsc := strings.ReplaceAll(growth, "'", "''")

			sql := fmt.Sprintf(
				"INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes) "+
					"VALUES ('vi', 'planet_in_house', '%s', '%s', '', '%s', '%s', '%s', '%s', '%s', '%s', ARRAY['%s ở %s', '%s', '%s']) "+
					"ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3) "+
					"DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges, relationships = EXCLUDED.relationships, growth_path = EXCLUDED.growth_path, key_themes = EXCLUDED.key_themes;",
				p.EnName, h.Num, coreEsc, realEsc, strEsc, chalEsc, relEsc, growthEsc, p.ViName, h.ViName, p.ViName, h.ViName,
			)
			sqls = append(sqls, sql)
		}
	}

	// Split into 3 easy-to-run files (~100KB each)
	total := len(sqls) - 1
	chunkSize := (total + 2) / 3

	for part := 1; part <= 3; part++ {
		start := 1 + (part-1)*chunkSize
		end := start + chunkSize
		if end > len(sqls) {
			end = len(sqls)
		}
		if start >= len(sqls) {
			break
		}

		chunk := sqls[start:end]
		header := fmt.Sprintf("-- ENHANCED VIETNAMESE PLANET INTERPRETATIONS (PART %d of 3)\n\n", part)
		fileContent := header + strings.Join(chunk, "\n\n")

		fileName := fmt.Sprintf("fix_vi_planets_part%d.sql", part)
		err := os.WriteFile(fileName, []byte(fileContent), 0644)
		if err != nil {
			fmt.Printf("Error writing %s: %v\n", fileName, err)
			return
		}
		fmt.Printf("Wrote %s (%d statements)\n", fileName, len(chunk))
	}
}
