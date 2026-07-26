package main

import "fmt"

func getMockHouseSeeds() []SeedData {
	planets := []string{"Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North Node", "Chiron"}
	houses := []string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"}

	planetThemesEn := map[string]string{
		"Sun": "core identity and vitality", "Moon": "emotions and instincts", "Mercury": "communication and intellect", "Venus": "love and values",
		"Mars": "drive and action", "Jupiter": "expansion and belief", "Saturn": "discipline and structure", "Uranus": "innovation and rebellion",
		"Neptune": "dreams and spirituality", "Pluto": "transformation and power", "North Node": "karmic path", "Chiron": "deepest wounds",
	}
	houseThemesEn := map[string]string{
		"1": "self, identity, and appearance", "2": "values, possessions, and self-worth", "3": "communication, siblings, and environment", "4": "home, family, and roots",
		"5": "creativity, romance, and self-expression", "6": "daily routines, health, and service", "7": "partnerships, marriage, and one-on-one connections", "8": "transformation, shared resources, and intimacy",
		"9": "philosophy, higher learning, and travel", "10": "career, public image, and reputation", "11": "friendships, groups, and collective aspirations", "12": "subconscious, hidden matters, and spirituality",
	}

	planetThemesVi := map[string]string{
		"Sun": "bản sắc cốt lõi", "Moon": "cảm xúc và bản năng", "Mercury": "giao tiếp và trí tuệ", "Venus": "tình yêu và giá trị",
		"Mars": "động lực và hành động", "Jupiter": "sự mở rộng và niềm tin", "Saturn": "kỷ luật và cấu trúc", "Uranus": "sự đổi mới và nổi loạn",
		"Neptune": "giấc mơ và tâm linh", "Pluto": "sự biến đổi và quyền lực", "North Node": "con đường nghiệp quả", "Chiron": "những vết thương sâu sắc",
	}
	planetNamesVi := map[string]string{
		"Sun": "Mặt Trời", "Moon": "Mặt Trăng", "Mercury": "Sao Thủy", "Venus": "Sao Kim",
		"Mars": "Sao Hỏa", "Jupiter": "Sao Mộc", "Saturn": "Sao Thổ", "Uranus": "Sao Thiên Vương",
		"Neptune": "Sao Hải Vương", "Pluto": "Sao Diêm Vương", "North Node": "Bắc Giao Điểm", "Chiron": "Chiron",
	}
	houseThemesVi := map[string]string{
		"1": "bản thân, danh tính và ngoại hình", "2": "giá trị, tài sản và lòng tự trọng", "3": "giao tiếp, anh chị em và môi trường", "4": "gia đình, tổ ấm và cội nguồn",
		"5": "sáng tạo, lãng mạn và thể hiện bản thân", "6": "thói quen hàng ngày, sức khỏe và phục vụ", "7": "đối tác, hôn nhân và kết nối cá nhân", "8": "biến đổi, tài nguyên chung và sự thân mật",
		"9": "triết học, học vấn cao và du lịch", "10": "sự nghiệp, hình ảnh công chúng và danh tiếng", "11": "tình bạn, nhóm xã hội và khát vọng", "12": "tiềm thức, những vấn đề ẩn giấu và tâm linh",
	}

	var seeds []SeedData
	for _, p := range planets {
		for _, h := range houses {
			// English Seed
			seeds = append(seeds, SeedData{
				Language:      "en",
				FactorType:    "planet_in_house",
				FactorValue1:  p,
				FactorValue2:  h,
				FactorValue3:  "",
				CoreMeaning:   fmt.Sprintf("With your %s in the %s House, your %s is deeply focused on the realm of %s.", p, h, planetThemesEn[p], houseThemesEn[h]),
				RealLife:      fmt.Sprintf("In real life, this placement suggests you invest your %s primarily into matters regarding %s.", planetThemesEn[p], houseThemesEn[h]),
				Strengths:     fmt.Sprintf("Your ability to bring the energy of %s into the domain of %s.", p, houseThemesEn[h]),
				Challenges:    fmt.Sprintf("Over-identifying or struggling to channel your %s appropriately in the area of %s.", p, houseThemesEn[h]),
				Relationships: fmt.Sprintf("In relationships, your focus on %s shapes how you connect with others in this domain.", houseThemesEn[h]),
				GrowthPath:    fmt.Sprintf("To grow, you must learn to balance your %s within the context of %s.", planetThemesEn[p], houseThemesEn[h]),
				KeyThemes:     []string{p, "House " + h, "Focus", "Integration", "Expression"},
			})

			// Vietnamese Seed
			seeds = append(seeds, SeedData{
				Language:      "vi",
				FactorType:    "planet_in_house",
				FactorValue1:  p,
				FactorValue2:  h,
				FactorValue3:  "",
				CoreMeaning:   fmt.Sprintf("Với %s ở Nhà %s, %s của bạn tập trung sâu sắc vào lĩnh vực %s.", planetNamesVi[p], h, planetThemesVi[p], houseThemesVi[h]),
				RealLife:      fmt.Sprintf("Trong cuộc sống thực, vị trí này cho thấy bạn chủ yếu dành %s của mình vào các vấn đề liên quan đến %s.", planetThemesVi[p], houseThemesVi[h]),
				Strengths:     fmt.Sprintf("Khả năng mang năng lượng của %s vào lĩnh vực %s.", planetNamesVi[p], houseThemesVi[h]),
				Challenges:    fmt.Sprintf("Quá đồng nhất hoặc gặp khó khăn trong việc định hướng %s phù hợp trong lĩnh vực %s.", planetNamesVi[p], houseThemesVi[h]),
				Relationships: fmt.Sprintf("Trong các mối quan hệ, sự tập trung vào %s định hình cách bạn kết nối với người khác trong lĩnh vực này.", houseThemesVi[h]),
				GrowthPath:    fmt.Sprintf("Để phát triển, bạn phải học cách cân bằng %s trong bối cảnh %s.", planetThemesVi[p], houseThemesVi[h]),
				KeyThemes:     []string{planetNamesVi[p], "Nhà " + h, "Tập trung", "Tích hợp", "Thể hiện"},
			})
		}
	}
	return seeds
}

func getMockAspectSeeds() []SeedData {
	planets := []string{"Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North Node", "Chiron"}
	aspects := []string{"conjunction", "opposition", "trine", "square", "sextile", "quincunx", "semisquare", "sesquiquadrate", "semi-sextile"}

	planetThemesEn := map[string]string{
		"Sun": "core identity and vitality", "Moon": "emotions and instincts", "Mercury": "communication and intellect", "Venus": "love and values",
		"Mars": "drive and action", "Jupiter": "expansion and belief", "Saturn": "discipline and structure", "Uranus": "innovation and rebellion",
		"Neptune": "dreams and spirituality", "Pluto": "transformation and power", "North Node": "karmic path", "Chiron": "deepest wounds",
	}
	aspectThemesEn := map[string]string{
		"conjunction": "blend their energies powerfully", "opposition": "create a polarizing dynamic of balance and tension",
		"trine": "flow harmoniously and effortlessly", "square": "generate friction that demands growth", "sextile": "offer opportunities for productive collaboration",
		"quincunx": "require constant adjustment and integration", "semisquare": "create subtle internal tension", "sesquiquadrate": "produce low-level, persistent friction", "semi-sextile": "require conscious effort to connect",
	}

	planetThemesVi := map[string]string{
		"Sun": "bản sắc cốt lõi", "Moon": "cảm xúc và bản năng", "Mercury": "giao tiếp và trí tuệ", "Venus": "tình yêu và giá trị",
		"Mars": "động lực và hành động", "Jupiter": "sự mở rộng và niềm tin", "Saturn": "kỷ luật và cấu trúc", "Uranus": "sự đổi mới và nổi loạn",
		"Neptune": "giấc mơ và tâm linh", "Pluto": "sự biến đổi và quyền lực", "North Node": "con đường nghiệp quả", "Chiron": "những vết thương sâu sắc",
	}
	planetNamesVi := map[string]string{
		"Sun": "Mặt Trời", "Moon": "Mặt Trăng", "Mercury": "Sao Thủy", "Venus": "Sao Kim",
		"Mars": "Sao Hỏa", "Jupiter": "Sao Mộc", "Saturn": "Sao Thổ", "Uranus": "Sao Thiên Vương",
		"Neptune": "Sao Hải Vương", "Pluto": "Sao Diêm Vương", "North Node": "Bắc Giao Điểm", "Chiron": "Chiron",
	}
	aspectThemesVi := map[string]string{
		"conjunction": "hòa quyện năng lượng mạnh mẽ", "opposition": "tạo ra sự phân cực giữa cân bằng và căng thẳng",
		"trine": "chảy một cách hài hòa và dễ dàng", "square": "tạo ra ma sát đòi hỏi sự phát triển", "sextile": "mang đến cơ hội hợp tác hiệu quả",
		"quincunx": "đòi hỏi sự điều chỉnh và tích hợp liên tục", "semisquare": "tạo ra căng thẳng nội tâm tinh tế", "sesquiquadrate": "tạo ra sự ma sát dai dẳng", "semi-sextile": "đòi hỏi nỗ lực có ý thức để kết nối",
	}
	aspectNamesVi := map[string]string{
		"conjunction": "Trùng Tụ", "opposition": "Đối Góc",
		"trine": "Tam Hợp", "square": "Vuông Góc", "sextile": "Lục Hợp",
		"quincunx": "Bất Tương", "semisquare": "Bán Vuông Góc", "sesquiquadrate": "Bán Vuông Góc Kép", "semi-sextile": "Bán Lục Hợp",
	}

	var seeds []SeedData
	for i := 0; i < len(planets); i++ {
		for j := i + 1; j < len(planets); j++ {
			for _, a := range aspects {
				p1, p2 := planets[i], planets[j]
				if p1 > p2 {
					p1, p2 = p2, p1
				}

				// English Seed
				seeds = append(seeds, SeedData{
					Language:      "en",
					FactorType:    "aspect",
					FactorValue1:  p1,
					FactorValue2:  p2,
					FactorValue3:  a,
					CoreMeaning:   fmt.Sprintf("The dynamic between your %s (%s) and %s (%s) is one where they %s.", p1, planetThemesEn[p1], p2, planetThemesEn[p2], aspectThemesEn[a]),
					RealLife:      fmt.Sprintf("In real life, this %s aspect means you often experience the themes of %s alongside %s in ways that %s.", a, planetThemesEn[p1], planetThemesEn[p2], aspectThemesEn[a]),
					Strengths:     fmt.Sprintf("Your innate ability to combine the energy of %s with %s.", p1, p2),
					Challenges:    fmt.Sprintf("Navigating the complexities when %s and %s are triggered simultaneously.", p1, p2),
					Relationships: fmt.Sprintf("In relationships, this %s influences how you express %s and %s towards others.", a, planetThemesEn[p1], planetThemesEn[p2]),
					GrowthPath:    fmt.Sprintf("To grow, you must learn to master the interaction between your %s and %s.", p1, p2),
					KeyThemes:     []string{p1, p2, a, "Integration", "Dynamics"},
				})

				// Vietnamese Seed
				seeds = append(seeds, SeedData{
					Language:      "vi",
					FactorType:    "aspect",
					FactorValue1:  p1,
					FactorValue2:  p2,
					FactorValue3:  a,
					CoreMeaning:   fmt.Sprintf("Sự tương tác giữa %s (%s) và %s (%s) của bạn là nơi chúng %s.", planetNamesVi[p1], planetThemesVi[p1], planetNamesVi[p2], planetThemesVi[p2], aspectThemesVi[a]),
					RealLife:      fmt.Sprintf("Trong cuộc sống thực, góc chiếu %s này có nghĩa là bạn thường trải nghiệm các chủ đề về %s cùng với %s theo những cách %s.", aspectNamesVi[a], planetThemesVi[p1], planetThemesVi[p2], aspectThemesVi[a]),
					Strengths:     fmt.Sprintf("Khả năng bẩm sinh của bạn trong việc kết hợp năng lượng của %s và %s.", planetNamesVi[p1], planetNamesVi[p2]),
					Challenges:    fmt.Sprintf("Vượt qua sự phức tạp khi %s và %s được kích hoạt cùng một lúc.", planetNamesVi[p1], planetNamesVi[p2]),
					Relationships: fmt.Sprintf("Trong các mối quan hệ, góc chiếu %s này ảnh hưởng đến cách bạn thể hiện %s và %s với người khác.", aspectNamesVi[a], planetThemesVi[p1], planetThemesVi[p2]),
					GrowthPath:    fmt.Sprintf("Để phát triển, bạn phải học cách làm chủ sự tương tác giữa %s và %s.", planetNamesVi[p1], planetNamesVi[p2]),
					KeyThemes:     []string{planetNamesVi[p1], planetNamesVi[p2], aspectNamesVi[a], "Tích hợp", "Tương tác"},
				})
			}
		}
	}
	return seeds
}

func getMockHouseInSignSeeds() []SeedData {
	houses := []string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"}
	signs := []string{"Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"}

	houseThemesEn := map[string]string{
		"1": "self, identity, and appearance", "2": "values, possessions, and self-worth", "3": "communication, siblings, and environment", "4": "home, family, and roots",
		"5": "creativity, romance, and self-expression", "6": "daily routines, health, and service", "7": "partnerships, marriage, and one-on-one connections", "8": "transformation, shared resources, and intimacy",
		"9": "philosophy, higher learning, and travel", "10": "career, public image, and reputation", "11": "friendships, groups, and collective aspirations", "12": "subconscious, hidden matters, and spirituality",
	}
	signTraitsEn := map[string]string{
		"Aries": "direct, pioneering, and energetic", "Taurus": "grounded, persistent, and sensual", "Gemini": "curious, adaptable, and communicative",
		"Cancer": "intuitive, nurturing, and emotional", "Leo": "dramatic, expressive, and confident", "Virgo": "analytical, practical, and detail-oriented",
		"Libra": "diplomatic, harmonious, and relationship-focused", "Scorpio": "intense, transformative, and probing", "Sagittarius": "adventurous, philosophical, and optimistic",
		"Capricorn": "ambitious, disciplined, and structured", "Aquarius": "innovative, unconventional, and humanitarian", "Pisces": "empathetic, imaginative, and spiritual",
	}

	houseThemesVi := map[string]string{
		"1": "bản thân, danh tính và ngoại hình", "2": "giá trị, tài sản và lòng tự trọng", "3": "giao tiếp, anh chị em và môi trường", "4": "gia đình, tổ ấm và cội nguồn",
		"5": "sáng tạo, lãng mạn và thể hiện bản thân", "6": "thói quen hàng ngày, sức khỏe và phục vụ", "7": "đối tác, hôn nhân và kết nối cá nhân", "8": "biến đổi, tài nguyên chung và sự thân mật",
		"9": "triết học, học vấn cao và du lịch", "10": "sự nghiệp, hình ảnh công chúng và danh tiếng", "11": "tình bạn, nhóm xã hội và khát vọng", "12": "tiềm thức, những vấn đề ẩn giấu và tâm linh",
	}
	signTraitsVi := map[string]string{
		"Aries": "trực tiếp, tiên phong và tràn đầy năng lượng", "Taurus": "thực tế, kiên trì và gợi cảm", "Gemini": "tò mò, dễ thích nghi và hoạt ngôn",
		"Cancer": "trực giác, nuôi dưỡng và giàu cảm xúc", "Leo": "kịch tính, biểu cảm và tự tin", "Virgo": "phân tích, thực tế và chú ý đến chi tiết",
		"Libra": "ngoại giao, hài hòa và tập trung vào các mối quan hệ", "Scorpio": "mãnh liệt, biến đổi và sâu sắc", "Sagittarius": "thích phiêu lưu, triết lý và lạc quan",
		"Capricorn": "tham vọng, kỷ luật và có cấu trúc", "Aquarius": "đổi mới, khác biệt và nhân đạo", "Pisces": "đồng cảm, giàu trí tưởng tượng và tâm linh",
	}

	var seeds []SeedData
	for _, h := range houses {
		for _, s := range signs {
			// English Seed
			seeds = append(seeds, SeedData{
				Language:      "en",
				FactorType:    "house_in_sign",
				FactorValue1:  h,
				FactorValue2:  s,
				FactorValue3:  "",
				CoreMeaning:   fmt.Sprintf("With your %s House in %s, you approach matters of %s in a %s manner.", h, s, houseThemesEn[h], signTraitsEn[s]),
				RealLife:      fmt.Sprintf("In real life, the %s energy of %s dictates how you navigate %s.", signTraitsEn[s], s, houseThemesEn[h]),
				Strengths:     fmt.Sprintf("Applying the %s qualities of %s to the domain of %s.", signTraitsEn[s], s, houseThemesEn[h]),
				Challenges:    fmt.Sprintf("Overcoming the negative tendencies of %s when dealing with %s.", s, houseThemesEn[h]),
				Relationships: fmt.Sprintf("Your %s style influences how you interact with others regarding %s.", s, houseThemesEn[h]),
				GrowthPath:    fmt.Sprintf("To grow, you must embrace the positive expressions of %s in your %s.", s, houseThemesEn[h]),
				KeyThemes:     []string{"House " + h, s, "Approach", "Environment", "Attitude"},
			})

			// Vietnamese Seed
			seeds = append(seeds, SeedData{
				Language:      "vi",
				FactorType:    "house_in_sign",
				FactorValue1:  h,
				FactorValue2:  s,
				FactorValue3:  "",
				CoreMeaning:   fmt.Sprintf("Với Nhà %s ở %s, bạn tiếp cận các vấn đề về %s một cách %s.", h, s, houseThemesVi[h], signTraitsVi[s]),
				RealLife:      fmt.Sprintf("Trong cuộc sống thực, năng lượng %s của %s định hình cách bạn điều hướng %s.", signTraitsVi[s], s, houseThemesVi[h]),
				Strengths:     fmt.Sprintf("Áp dụng phẩm chất %s của %s vào lĩnh vực %s.", signTraitsVi[s], s, houseThemesVi[h]),
				Challenges:    fmt.Sprintf("Vượt qua các xu hướng tiêu cực của %s khi giải quyết %s.", s, houseThemesVi[h]),
				Relationships: fmt.Sprintf("Phong cách %s của bạn ảnh hưởng đến cách bạn tương tác với người khác liên quan đến %s.", s, houseThemesVi[h]),
				GrowthPath:    fmt.Sprintf("Để phát triển, bạn phải nắm bắt những biểu hiện tích cực của %s trong %s của bạn.", s, houseThemesVi[h]),
				KeyThemes:     []string{"Nhà " + h, s, "Tiếp cận", "Môi trường", "Thái độ"},
			})
		}
	}
	return seeds
}
