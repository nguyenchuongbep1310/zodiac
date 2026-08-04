package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

var signViMap = map[string]string{
	"Aries":       "Bạch Dương",
	"Taurus":      "Kim Ngưu",
	"Gemini":      "Song Tử",
	"Cancer":      "Cự Giải",
	"Leo":         "Sư Tử",
	"Virgo":       "Xử Nữ",
	"Libra":       "Thiên Bình",
	"Scorpio":     "Bọ Cạp",
	"Sagittarius": "Nhân Mã",
	"Capricorn":   "Ma Kết",
	"Aquarius":    "Bảo Bình",
	"Pisces":      "Song Ngư",
}

var houseThemesVi = map[string]string{
	"1":  "Bản ngã được thể hiện qua năng lượng %s. Bạn tiếp cận thế giới xung quanh với tinh thần %s.",
	"2":  "Giá trị bản thân và khả năng quản lý tài chính gắn liền với đặc tính %s. Bạn tạo ra thu nhập và sự an toàn vật chất thông qua sự %s.",
	"3":  "Tư duy, giao tiếp và khả năng học hỏi mang màu sắc %s. Bạn tiếp thu thông tin và kết nối với môi trường xung quanh một cách %s.",
	"4":  "Nền tảng gia đình, nguồn cội và không gian an toàn nội tâm thấm đượm năng lượng %s. Bạn tìm kiếm sự bình yên thông qua %s.",
	"5":  "Năng lực sáng tạo, niềm vui và trải nghiệm tình yêu tỏa sáng qua lăng kính %s. Bạn thể hiện sự đam mê một cách %s.",
	"6":  "Kỷ luật công việc, chăm sóc sức khỏe và tinh thần phục vụ mang đặc đặc tính %s. Bạn hoàn thành trách nhiệm hằng ngày một cách %s.",
	"7":  "Mối quan hệ đối tác, tình cảm và sự hợp tác được định hình bởi năng lượng %s. Bạn tìm kiếm sự cân bằng và đồng hành %s.",
	"8":  "Sức mạnh chuyển hóa, tài chính chung và sự gắn kết sâu sắc mang chiều sâu %s. Bạn đối mặt với biến chuyển cuộc sống một cách %s.",
	"9":  "Tầm nhìn triết lý, tri thức mở rộng và tinh thần khám phá phát triển qua lăng kính %s. Bạn vươn tới mục tiêu cao đẹp một cách %s.",
	"10": "Sự nghiệp, uy tín xã hội và mục tiêu dài hạn phản ánh bản lĩnh %s. Bạn xây dựng chỗ đứng và danh tiếng một cách %s.",
	"11": "Mạng lưới cộng đồng, bạn bè và những khát vọng tương lai mang tinh thần %s. Bạn gắn kết với tập thể một cách %s.",
	"12": "Thế giới tiềm thức, trực giác tâm linh và hành trình chữa lành mang năng lượng %s. Bạn tìm thấy sự an trú nội tâm một cách %s.",
}

var signTraitsVi = map[string][2]string{
	"Aries":       {"tiên phong, quyết đoán và độc lập của Bạch Dương", "trực diện, dũng cảm và nhiệt huyết"},
	"Taurus":      {"kiên định, bền bỉ và thực tế của Kim Ngưu", "vững chắc, cẩn trọng và coi trọng chất lượng"},
	"Gemini":      {"nhanh trí, linh hoạt và tò mò của Song Tử", "cởi mở, đa dạng và giỏi giao tiếp"},
	"Cancer":      {"nhạy cảm, thấu cảm và chu đáo của Cự Giải", "ấm áp, bảo vệ và giàu tình cảm"},
	"Leo":         {"kiêu hãnh, tự tin và sáng tạo của Sư Tử", "rực rỡ, hào phóng và cuốn hút"},
	"Virgo":       {"tỉ mỉ, cẩn thận và thực tế của Xử Nữ", "chỉn chu, phân tích và có phương pháp"},
	"Libra":       {"hài hòa, lịch thiệp và công bằng của Thiên Bình", "khéo léo, tinh tế và hướng tới sự cân bằng"},
	"Scorpio":     {"sâu sắc, kiên cường và thâm trầm của Bọ Cạp", "mãnh liệt, trực giác và bí ẩn"},
	"Sagittarius": {"phóng khoáng, lạc quan và yêu tự do của Nhân Mã", "thẳng thắn, rộng mở và giàu lý tưởng"},
	"Capricorn":   {"kỷ luật, trách nhiệm và thực tế của Ma Kết", "kiên trì, bài bản và có tầm nhìn dài hạn"},
	"Aquarius":    {"độc đáo, tiến bộ và hướng tới cộng đồng của Bảo Bình", "đột phá, trí tuệ và phi truyền thống"},
	"Pisces":      {"mềm mại, vị tha và sâu sắc của Song Ngư", "thấu cảm, lãng mạn và giàu trí tưởng tượng"},
}

func escapeSQL(s string) string {
	return strings.ReplaceAll(s, "'", "''")
}

func main() {
	houseFiles := []string{
		"backend/_scripts/insert_houses.go",
		"backend/_scripts/insert_houses_456.go",
		"backend/_scripts/insert_houses_789.go",
		"backend/_scripts/insert_houses_101112.go",
	}

	tupleRegex := regexp.MustCompile(`\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\)`)

	out, err := os.Create("fix_vietnamese_houses_all.sql")
	if err != nil {
		panic(err)
	}
	defer out.Close()

	out.WriteString("-- FIX ALL VIETNAMESE HOUSE IN SIGN INTERPRETATIONS\n\n")

	count := 0
	for _, file := range houseFiles {
		content, err := os.ReadFile(file)
		if err != nil {
			fmt.Printf("Error reading %s: %v\n", file, err)
			continue
		}

		matches := tupleRegex.FindAllStringSubmatch(string(content), -1)
		for _, m := range matches {
			houseName := m[1] // "House 1"
			houseNum := strings.TrimPrefix(houseName, "House ")
			sign := m[2]      // "Aries"
			signVi := signViMap[sign]

			traits := signTraitsVi[sign]
			coreVi := fmt.Sprintf(houseThemesVi[houseNum], traits[0], traits[1])

			realLifeEn := m[4]
			strengthsEn := m[5]
			challengesEn := m[6]
			relEn := m[7]
			growthEn := m[8]

			// Translate key summary parts
			realLifeVi := fmt.Sprintf("Trong cuộc sống hằng ngày, vị trí Nhà %s ở %s định hình phản ứng thực tế và cách bạn thể hiện bản thân. %s", houseNum, signVi, realLifeEn)
			strengthsVi := fmt.Sprintf("Sức mạnh nổi bật đến từ sự kết hợp giữa lĩnh vực Nhà %s và năng lượng %s: %s", houseNum, signVi, strengthsEn)
			challengesVi := fmt.Sprintf("Thách thức cần lưu ý: %s", challengesEn)
			relVi := relEn
			growthVi := growthEn

			sql := fmt.Sprintf(
				"INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes) VALUES ('vi', 'house_in_sign', '%s', '%s', '', '%s', '%s', '%s', '%s', '%s', '%s', ARRAY['Nhà %s', '%s']) ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3) DO UPDATE SET core_meaning = EXCLUDED.core_meaning, real_life = EXCLUDED.real_life, strengths = EXCLUDED.strengths, challenges = EXCLUDED.challenges;\n",
				houseNum, sign,
				escapeSQL(coreVi),
				escapeSQL(realLifeVi),
				escapeSQL(strengthsVi),
				escapeSQL(challengesVi),
				escapeSQL(relVi),
				escapeSQL(growthVi),
				houseNum, signVi,
			)
			out.WriteString(sql)
			count++
		}
	}

	fmt.Printf("Generated fix_vietnamese_houses_all.sql with %d entries\n", count)
}
