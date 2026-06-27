package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Planet struct {
	Name    string
	EnTheme string
	ViTheme string
}

type Sign struct {
	Name    string
	EnTrait string
	ViTrait string
}

type House struct {
	Number  int
	EnFocus string
	ViFocus string
}

var planets = []Planet{
	{"Sun", "core identity, vitality, and ego", "bản sắc cốt lõi, sức sống và cái tôi"},
	{"Moon", "emotions, instincts, and subconscious", "cảm xúc, bản năng và tiềm thức"},
	{"Mercury", "communication and intellect", "giao tiếp và trí tuệ"},
	{"Venus", "love, aesthetics, and relationships", "tình yêu, thẩm mỹ và các mối quan hệ"},
	{"Mars", "action, drive, and desire", "hành động, động lực và khát vọng"},
	{"Jupiter", "expansion, luck, and philosophy", "sự mở rộng, may mắn và triết lý"},
	{"Saturn", "restriction, discipline, and responsibility", "hạn chế, kỷ luật và trách nhiệm"},
	{"Uranus", "innovation, rebellion, and sudden change", "đổi mới, nổi loạn và thay đổi bất ngờ"},
	{"Neptune", "dreams, illusion, and spirituality", "giấc mơ, ảo tưởng và tâm linh"},
	{"Pluto", "transformation, power, and rebirth", "biến đổi, quyền lực và tái sinh"},
	{"North Node", "karmic destiny and life purpose", "định mệnh nghiệp chướng và mục đích sống"},
	{"Chiron", "deepest wounds and healing journey", "vết thương sâu sắc nhất và hành trình chữa lành"},
}

var signs = []Sign{
	{"Aries", "direct, pioneering, and energetic", "trực tiếp, tiên phong và tràn đầy năng lượng"},
	{"Taurus", "grounded, persistent, and sensual", "thực tế, kiên trì và gợi cảm"},
	{"Gemini", "curious, adaptable, and communicative", "tò mò, dễ thích nghi và hoạt ngôn"},
	{"Cancer", "intuitive, nurturing, and emotional", "trực giác, nuôi dưỡng và giàu cảm xúc"},
	{"Leo", "dramatic, expressive, and confident", "kịch tính, biểu cảm và tự tin"},
	{"Virgo", "analytical, practical, and detail-oriented", "phân tích, thực tế và chú ý đến chi tiết"},
	{"Libra", "harmonious, diplomatic, and partnership-focused", "hài hòa, ngoại giao và hướng tới quan hệ đối tác"},
	{"Scorpio", "intense, passionate, and investigative", "mãnh liệt, đam mê và thích điều tra"},
	{"Sagittarius", "adventurous, philosophical, and optimistic", "phiêu lưu, triết lý và lạc quan"},
	{"Capricorn", "ambitious, disciplined, and pragmatic", "tham vọng, kỷ luật và thực dụng"},
	{"Aquarius", "progressive, unconventional, and visionary", "tiến bộ, độc đáo và có tầm nhìn"},
	{"Pisces", "empathetic, mystical, and imaginative", "đồng cảm, huyền bí và giàu trí tưởng tượng"},
}

var houses = []House{
	{1, "personal identity, appearance, and first impressions", "bản sắc cá nhân, ngoại hình và ấn tượng đầu tiên"},
	{2, "material possessions, self-worth, and values", "tài sản vật chất, giá trị bản thân và giá trị cốt lõi"},
	{3, "communication, siblings, and local environment", "giao tiếp, anh chị em và môi trường xung quanh"},
	{4, "home, family roots, and inner security", "nhà cửa, nguồn cội gia đình và sự an toàn nội tâm"},
	{5, "creativity, romance, and self-expression", "sáng tạo, sự lãng mạn và thể hiện bản thân"},
	{6, "daily work, routines, and physical health", "công việc hàng ngày, thói quen và sức khỏe thể chất"},
	{7, "partnerships, marriage, and open enemies", "đối tác, hôn nhân và những kẻ thù công khai"},
	{8, "transformation, shared resources, and intimacy", "sự biến đổi, tài nguyên chung và sự thân mật"},
	{9, "higher learning, long-distance travel, and beliefs", "học thức cao, du lịch xa và niềm tin"},
	{10, "career, public standing, and long-term goals", "sự nghiệp, danh tiếng và mục tiêu dài hạn"},
	{11, "friendships, networks, and collective goals", "tình bạn, mạng lưới quan hệ và mục tiêu tập thể"},
	{12, "spirituality, subconscious, and hidden matters", "tâm linh, tiềm thức và những điều ẩn giấu"},
}

func main() {
	upSql := "-- ─── Auto-generated Interpretation Templates ─────────────────────────────\n\n"
	downSql := "-- Revert auto-generated interpretations\n\n"

	// Iterate Planets in Signs
	for _, p := range planets {
		// Clean planet names for deletion matching
		downSql += fmt.Sprintf("DELETE FROM interpretation_templates WHERE factor_value_1 = '%s';\n", p.Name)
		
		for _, s := range signs {
			// English
			titleEn := fmt.Sprintf("%s in %s", p.Name, s.Name)
			contentEn := fmt.Sprintf("With %s in %s, the themes of %s take on a %s flavor. This placement infuses your chart with unique characteristics, blending the planet's core energy with the sign's modality and element.", p.Name, s.Name, p.EnTheme, s.EnTrait)
			keywordsEn := `["` + strings.ReplaceAll(p.EnTheme, ", and ", `", "`) + `", "` + strings.ReplaceAll(s.EnTrait, ", and ", `", "`) + `"]`
			upSql += insertStmt("en", "planet_in_sign", p.Name, s.Name, titleEn, contentEn, keywordsEn)

			// Vietnamese
			titleVi := fmt.Sprintf("Sao %s ở %s", p.Name, s.Name)
			if p.Name == "North Node" { titleVi = fmt.Sprintf("Bắc Giao ở %s", s.Name) }
			if p.Name == "Chiron" { titleVi = fmt.Sprintf("Chiron ở %s", s.Name) }
			contentVi := fmt.Sprintf("Với %s ở %s, các chủ đề về %s mang một sắc thái %s. Vị trí này truyền vào bản đồ sao của bạn những đặc điểm độc đáo, kết hợp năng lượng cốt lõi của hành tinh với đặc tính và nguyên tố của cung hoàng đạo.", titleVi[:strings.Index(titleVi, " ở")], s.Name, p.ViTheme, s.ViTrait)
			keywordsVi := `["` + strings.ReplaceAll(p.ViTheme, " và ", `", "`) + `", "` + strings.ReplaceAll(s.ViTrait, " và ", `", "`) + `"]`
			upSql += insertStmt("vi", "planet_in_sign", p.Name, s.Name, titleVi, contentVi, keywordsVi)
		}
	}

	// Iterate Planets in Houses
	for _, p := range planets {
		for _, h := range houses {
			hStr := fmt.Sprintf("%d", h.Number)
			
			// English
			titleEn := fmt.Sprintf("%s in the %d House", p.Name, h.Number)
			contentEn := fmt.Sprintf("Having %s in the %d House directs the energy of %s towards matters of %s. This indicates a significant area of focus and development throughout your life.", p.Name, h.Number, p.EnTheme, h.EnFocus)
			keywordsEn := `["` + strings.ReplaceAll(p.EnTheme, ", and ", `", "`) + `", "House ` + hStr + `"]`
			upSql += insertStmt("en", "planet_in_house", p.Name, hStr, titleEn, contentEn, keywordsEn)

			// Vietnamese
			titleVi := fmt.Sprintf("Sao %s ở Nhà %d", p.Name, h.Number)
			if p.Name == "North Node" { titleVi = fmt.Sprintf("Bắc Giao ở Nhà %d", h.Number) }
			if p.Name == "Chiron" { titleVi = fmt.Sprintf("Chiron ở Nhà %d", h.Number) }
			contentVi := fmt.Sprintf("Sở hữu %s ở Nhà %d hướng năng lượng của %s vào các vấn đề liên quan đến %s. Điều này chỉ ra một lĩnh vực trọng tâm và phát triển quan trọng trong suốt cuộc đời của bạn.", titleVi[:strings.Index(titleVi, " ở")], h.Number, p.ViTheme, h.ViFocus)
			keywordsVi := `["` + strings.ReplaceAll(p.ViTheme, " và ", `", "`) + `", "Nhà ` + hStr + `"]`
			upSql += insertStmt("vi", "planet_in_house", p.Name, hStr, titleVi, contentVi, keywordsVi)
		}
	}

	migrationsDir := "./migrations"
	os.MkdirAll(migrationsDir, os.ModePerm)

	err := os.WriteFile(filepath.Join(migrationsDir, "000003_seed_all_planets.up.sql"), []byte(upSql), 0644)
	if err != nil {
		panic(err)
	}

	err = os.WriteFile(filepath.Join(migrationsDir, "000003_seed_all_planets.down.sql"), []byte(downSql), 0644)
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully generated 000003_seed_all_planets migrations!")
}

func insertStmt(lang, fType, val1, val2, title, content, keywords string) string {
	// Simple escape for single quotes
	content = strings.ReplaceAll(content, "'", "''")
	title = strings.ReplaceAll(title, "'", "''")
	keywords = strings.ReplaceAll(keywords, "'", "''")
	
	// Convert ["a", "b"] to ARRAY['a', 'b']
	keywords = strings.ReplaceAll(keywords, `["`, `ARRAY['`)
	keywords = strings.ReplaceAll(keywords, `", "`, `', '`)
	keywords = strings.ReplaceAll(keywords, `"]`, `']`)

	return fmt.Sprintf("INSERT INTO interpretation_templates (language, factor_type, factor_value_1, factor_value_2, title, content, keywords) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', %s);\n",
		lang, fType, val1, val2, title, content, keywords)
}
