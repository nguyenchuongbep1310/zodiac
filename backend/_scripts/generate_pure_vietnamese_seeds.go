package main

import (
	"fmt"
	"log"
	"sort"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

type CelestialBody struct {
	EnName  string
	ViName  string
	Domain  string
	Action  string
}

var celestialBodies = []CelestialBody{
	{"Sun", "Mặt Trời", "bản ngã, ý chí cá nhân và nguồn năng lượng sống cốt lõi", "tỏa sáng, thể hiện cái tôi và hiện thực hóa mục tiêu cuộc sống"},
	{"Moon", "Mặt Trăng", "thế giới nội tâm, cảm xúc, trực giác và nhu cầu an toàn", "nuôi dưỡng tâm hồn, thấu cảm và bảo vệ người thân yêu"},
	{"Mercury", "Sao Thủy", "tư duy logic, khả năng giao tiếp và xử lý thông tin", "phân tích, học hỏi, trao đổi ý tưởng và kết nối tri thức"},
	{"Venus", "Sao Kim", "tình yêu, giá trị thẩm mỹ, nghệ thuật và sự hòa hợp trong quan hệ", "thu hút cái đẹp, gắn kết tình cảm và tận hưởng cuộc sống"},
	{"Mars", "Sao Hỏa", "năng lượng hành động, lòng dũng cảm và ý chí chinh phục", "hành động quyết đoán, tiên phong vượt qua thử thách và bảo vệ lập trường"},
	{"Jupiter", "Sao Mộc", "niềm tin, sự mở rộng tầm nhìn, triết lý sống và vận may", "học hỏi tri thức lớn, mở rộng trải nghiệm và lan tỏa tinh thần lạc quan"},
	{"Saturn", "Sao Thổ", "tính kỷ luật, trách nhiệm, cấu trúc bền vững và sự kiên trì", "xây dựng nền móng vững chắc, gánh vác trách nhiệm và rèn luyện bản lĩnh"},
	{"Uranus", "Sao Thiên Vương", "tư duy đổi mới, tính đột phá, tự do và trực giác tương lai", "bứt phá giới hạn, tạo ra sự khác biệt và thúc đẩy tiến bộ xã hội"},
	{"Neptune", "Sao Hải Vương", "trực giác tâm linh, trí tưởng tượng nghệ thuật và lòng trắc ẩn vô điều kiện", "kết nối với thế giới nội tâm sâu sắc, sáng tạo nghệ thuật và chữa lành tâm hồn"},
	{"Pluto", "Sao Diêm Vương", "sức mạnh chuyển hóa, chiều sâu tâm lý và sự tái sinh từ khủng hoảng", "đào sâu bản chất vấn đề, buông bỏ cái cũ và chuyển hóa nội tâm mạnh mẽ"},
	{"North Node", "Bắc Giao Điểm", "mục tiêu tiến hóa tâm hồn, bài học số phận và hướng đi cuộc đời", "vượt qua vùng an toàn, dấn thân vào trải nghiệm mới và phát triển tiềm năng cao nhất"},
	{"Chiron", "Chiron", "vết thương nội tâm sâu kín và khả năng chữa lành cho người khác", "thấu hiểu nỗi đau, chuyển hóa tổn thương thành trí tuệ và nâng đỡ người khác"},
}

type ZodiacSign struct {
	EnName   string
	ViName   string
	Style    string
	Core     string
	RelStyle string
	Growth   string
}

var zodiacSigns = []ZodiacSign{
	{"Aries", "Bạch Dương", "quyết đoán, nhiệt huyết, bốc lửa và mang tinh thần tiên phong", "sự can đảm và tốc độ hành động", "đầy đam mê, chủ động và tôn trọng sự độc lập của nhau", "tôi luyện tính kiên nhẫn và tránh hành động bốc đồng vội vã"},
	{"Taurus", "Kim Ngưu", "kiên định, thực tế, bền bỉ và coi trọng sự an toàn vững chắc", "sự kiên nhẫn, sức bền và cảm nhận thẩm mỹ tinh tế", "trung thành sâu sắc, ổn định, chân thành và thích chăm sóc đối phương", "học cách linh hoạt trước thay đổi và buông bỏ sự bám chấp vào vật chất"},
	{"Gemini", "Song Tử", "linh hoạt, nhanh trí, tò mò và giàu khả năng giao lưu kết nối", "sự đa dạng, trí tuệ sắc bén và khả năng xử lý đa nhiệm", "cởi mở, giao tiếp dí dỏm, cần sự đồng điệu về mặt trí tuệ", "tập trung năng lượng vào chiều sâu thay vì phân tán quá nhiều hướng"},
	{"Cancer", "Cự Giải", "nhạy cảm, ấm áp, sâu sắc về cảm xúc và giàu bản năng che chở", "trực giác nhạy bén, lòng thấu cảm và sự tận tụy bảo vệ tổ ấm", "gắn bó sâu sắc, chăm sóc ân cần và khao khát sự an toàn cảm xúc", "học cách thiết lập ranh giới cảm xúc lành mạnh để tránh bị tổn thương"},
	{"Leo", "Sư Tử", "kiêu hãnh, tự tin, rực rỡ, hào phóng và khao khát tỏa sáng", "khí chất lãnh đạo bẩm sinh, sự nhiệt huyết và sức hút truyền cảm hứng", "nhiệt thành, chung thủy, lãng mạn và mong muốn được trân trọng công nhận", "giữ gìn sự khiêm nhường chân chính và biết lắng nghe, chia sẻ hào quang"},
	{"Virgo", "Xử Nữ", "tỉ mỉ, chu đáo, có tính phân tích cao và định hướng phục vụ", "tư duy logic, sự cẩn trọng, kỷ luật và tinh thần cống hiến", "thể hiện tình cảm qua những hành động thực tế, chu toàn và đáng tin cậy", "học cách bao dung với những điều chưa hoàn hảo và giảm bớt sự tự phê bình"},
	{"Libra", "Thiên Bình", "hài hòa, thanh lịch, duyên dáng và coi trọng sự công bằng", "kỹ năng ngoại giao, cảm thụ nghệ thuật và khả năng dung hòa mâu thuẫn", "lãng mạn, lịch thiệp, tôn trọng sự bình đẳng và hướng tới sự hòa thuận", "học cách quyết đoán bày tỏ lập trường riêng thay vì né tránh xung đột"},
	{"Scorpio", "Bọ Cạp", "mãnh liệt, sâu sắc, bí ẩn, kiên cường và giàu sức mạnh chuyển hóa", "trực giác thấu thị, chiều sâu tâm lý và sức mạnh phục hồi phi thường", "cam kết tuyệt đối, nồng nàn, trung thành và bảo vệ mãnh liệt", "học cách tha thứ, buông bỏ sự kiểm soát và mở lòng tin tưởng"},
	{"Sagittarius", "Nhân Mã", "phóng khoáng, lạc quan, yêu tự do và luôn tìm kiếm ý nghĩa triết học", "tầm nhìn rộng mở, sự chân thành thẳng thắn và tinh thần phiêu lưu học hỏi", "cần không gian tự do, cùng nhau khám phá thế giới và chia sẻ lý tưởng sống", "cân bằng giữa tầm nhìn lớn và việc chú trọng vào các chi tiết thực thi"},
	{"Capricorn", "Ma Kết", "kỷ luật, trách nhiệm, kiên trì và định hướng thành tựu dài hạn", "tư duy chiến lược, sự bản lĩnh và khả năng gánh vác trách nhiệm lớn", "nghiêm túc, chung thủy, đáng tin cậy và cùng nhau xây dựng tương lai bền vững", "cho phép bản thân nghỉ ngơi, bộc lộ sự mềm mỏng và tận hưởng cuộc sống"},
	{"Aquarius", "Bảo Bình", "độc đáo, tiến bộ, sáng tạo và giàu tinh thần nhân đạo vì cộng đồng", "tư duy đổi mới, tính độc lập tự chủ và tầm nhìn đi trước thời đại", "bình đẳng, tôn trọng không gian riêng tư và trân trọng tình bạn chân thành", "học cách kết nối cảm xúc ấm áp bên cạnh việc chia sẻ trên bình diện lý trí"},
	{"Pisces", "Song Ngư", "giàu lòng trắc ẩn, nhạy cảm tâm linh, vị tha và tràn đầy trí tưởng tượng", "trực giác nhạy bén, khả năng thấu cảm vô bờ và tâm hồn nghệ thuật", "yêu hết mình, bao dung, sẵn sàng sẻ chia và mong muốn hòa hợp tâm hồn", "xây dựng ranh giới cá nhân rõ ràng và tiếp cận thực tế bằng sự tỉnh táo"},
}

type HouseDetail struct {
	Number     string
	Title      string
	Domain     string
	LifeArea   string
	Strengths  string
	Challenges string
}

var houseDetails = []HouseDetail{
	{
		Number:     "1",
		Title:      "Nhà 1 (Cung Mọc & Bản Sắc Cá Nhân)",
		Domain:     "bản thân, ngoại hình, phong thái và cách tiếp cận thế giới xung quanh",
		LifeArea:   "cách bạn bắt đầu mọi dự án, định hình ấn tượng đầu tiên và thể hiện bản sắc cá nhân độc lập",
		Strengths:  "sức sống mãnh liệt, năng lực tự chủ cao, phong thái tự tin và khả năng gây dựng dấu ấn riêng",
		Challenges: "xu hướng quá chú trọng vào cái tôi hoặc phản ứng phòng thủ trước những tác động từ bên ngoài",
	},
	{
		Number:     "2",
		Title:      "Nhà 2 (Tài Chính & Giá Trị Bản Thân)",
		Domain:     "tài chính cá nhân, tài sản, khả năng tạo thu nhập và cảm giác an toàn vật chất",
		LifeArea:   "cách bạn quản lý tiền bạc, đầu tư nguồn lực và xây dựng lòng tự trọng dựa trên giá trị thực tế",
		Strengths:  "khả năng tạo dựng nền tảng tài chính vững chắc, sự thực tế và khiếu đánh giá giá trị chuẩn xác",
		Challenges: "nỗi lo âu về sự thiếu hụt tài chính hoặc xu hướng gắn liền giá trị bản thân với của cải vật chất",
	},
	{
		Number:     "3",
		Title:      "Nhà 3 (Giao Tiếp & Học Hỏi)",
		Domain:     "giao tiếp, tư duy logic, học vấn ngắn hạn, phương tiện di chuyển và các mối quan hệ láng giềng, anh chị em",
		LifeArea:   "cách bạn tiếp nhận thông tin hàng ngày, diễn đạt suy nghĩ và tương tác với môi trường gần gũi",
		Strengths:  "tư duy nhanh nhẹn, kỹ năng truyền đạt thuyết phục, tính hiếu học và khả năng kết nối linh hoạt",
		Challenges: "sự phân tán tư tưởng, tình trạng quá tải thông tin hoặc thiếu kiên nhẫn khi lắng nghe người khác",
	},
	{
		Number:     "4",
		Title:      "Nhà 4 (Gia Đình & Cội Nguồn)",
		Domain:     "tổ ấm gia đình, cội nguồn dòng họ, nền tảng tâm lý và cảm giác an toàn sâu thẳm trong tâm hồn",
		LifeArea:   "cách bạn xây dựng không gian sống, chăm sóc các thành viên trong gia đình và bảo vệ sự bình yên nội tâm",
		Strengths:  "nội tâm vững vàng, lòng gắn kết gia đình bền chặt, sự chu đáo và khả năng tạo dựng chốn bình yên",
		Challenges: "sự bám chấp vào quá khứ hoặc những rào cản tâm lý bắt nguồn từ tuổi thơ chưa được tháo gỡ",
	},
	{
		Number:     "5",
		Title:      "Nhà 5 (Sáng Tạo & Tình Yêu)",
		Domain:     "sáng tạo nghệ thuật, tình yêu lãng mạn, niềm vui giải trí, con cái và sự tỏa sáng cá nhân",
		LifeArea:   "cách bạn tận hưởng niềm vui cuộc sống, bộc lộ tài năng thiên bẩm và trải nghiệm tình cảm lãng mạn",
		Strengths:  "sức sáng tạo phong phú, tinh thần lạc quan, sức hút lãng mạn và khả năng truyền cảm hứng vui tươi",
		Challenges: "nhu cầu được chú ý quá mức hoặc xu hướng tìm kiếm rủi ro bốc đồng trong các thú vui",
	},
	{
		Number:     "6",
		Title:      "Nhà 6 (Công Việc Hằng Ngày & Sức Khỏe)",
		Domain:     "công việc thường nhật, thói quen sinh hoạt, quy trình tổ chức, sức khỏe thể chất và tinh thần phụng sự",
		LifeArea:   "cách bạn quản lý thời gian, chăm sóc cơ thể, giải quyết nhiệm vụ công việc và giúp đỡ người khác",
		Strengths:  "tính kỷ luật cao, phương pháp làm việc khoa học, sự tận tâm và tinh thần cống hiến bền bỉ",
		Challenges: "tính cầu toàn thái quá, thói quen tự tạo áp lực căng thẳng hoặc phê bình quá mức",
	},
	{
		Number:     "7",
		Title:      "Nhà 7 (Hôn Nhân & Đối Tác)",
		Domain:     "hôn nhân, quan hệ tình cảm nghiêm túc, đối tác kinh doanh và sự dung hòa trong quan hệ một-đối-một",
		LifeArea:   "cách bạn chọn bạn đời, hợp tác làm ăn và tìm kiếm sự cân bằng giữa nhu cầu cá nhân và đối phương",
		Strengths:  "kỹ năng dung hòa xuất sắc, sự công bằng, khả năng lắng nghe và năng lực xây dựng quan hệ bền lâu",
		Challenges: "sự phụ thuộc cảm xúc vào đối phương hoặc né tránh giải quyết mâu thuẫn trực tiếp",
	},
	{
		Number:     "8",
		Title:      "Nhà 8 (Chuyển Hóa & Tài Sản Chung)",
		Domain:     "tài sản chung, đầu tư tài chính lớn, sự chuyển hóa tâm lý, bí ẩn cuộc sống và sự tái sinh từ thử thách",
		LifeArea:   "cách bạn đối diện với khủng hoảng, quản lý nguồn vốn hợp tác và vượt qua những giới hạn cũ",
		Strengths:  "trực giác sâu sắc, ý chí kiên cường, khả năng phục hồi thần kỳ và năng lực quản lý tài nguyên chung",
		Challenges: "tâm lý nghi ngờ, mong muốn kiểm soát đối phương hoặc khó khăn trong việc buông bỏ tổn thương",
	},
	{
		Number:     "9",
		Title:      "Nhà 9 (Triết Lý & Tầm Nhìn)",
		Domain:     "học vấn bậc cao, triết học, đạo đức, du lịch xa xứ, khám phá các nền văn hóa và tầm nhìn thế giới",
		LifeArea:   "cách bạn mở rộng hiểu biết, xây dựng lý tưởng sống và tìm kiếm chân lý cho hành trình cuộc đời",
		Strengths:  "tầm nhìn xa trông rộng, sự thông thái, tinh thần tự do phóng khoáng và lòng bao dung rộng lượng",
		Challenges: "sự giáo điều, áp đặt quan điểm cá nhân hoặc thiếu sự kiểm chứng thực tế cho các lý thuyết",
	},
	{
		Number:     "10",
		Title:      "Nhà 10 (Sự Nghiệp & Danh Tiếng)",
		Domain:     "sự nghiệp đỉnh cao, danh tiếng xã hội, thành tựu cuộc đời và vai trò lãnh đạo đóng góp cho cộng đồng",
		LifeArea:   "cách bạn khẳng định uy tín, theo đuổi mục tiêu lớn và xây dựng di sản có giá trị lâu dài",
		Strengths:  "bản lĩnh lãnh đạo, uy tín vững chắc, tư duy chiến lược và tinh thần trách nhiệm với xã hội",
		Challenges: "quá tham công tiếc việc, áp lực danh vọng hoặc bỏ bê đời sống cá nhân và gia đình",
	},
	{
		Number:     "11",
		Title:      "Nhà 11 (Cộng Đồng & Ước Mơ)",
		Domain:     "mạng lưới bạn bè, các tổ chức cộng đồng, lý tưởng nhân đạo và những ước mơ lớn cho tương lai",
		LifeArea:   "cách bạn xây dựng tình bạn, hòa nhập vào tập thể và đóng góp vào những mục tiêu chung vì xã hội",
		Strengths:  "tinh thần đồng đội tuyệt vời, tầm nhìn tiến bộ, sự công bằng và năng lực tập hợp lực lượng",
		Challenges: "cảm giác lạc lõng giữa đám đông hoặc thiếu sự sâu sắc trong các mối quan hệ cá nhân thân thiết",
	},
	{
		Number:     "12",
		Title:      "Nhà 12 (Tiềm Thức & Tâm Linh)",
		Domain:     "thế giới tiềm thức, đời sống tâm linh, trực giác vô thức, sự chữa lành và những tiềm năng chưa khai phá",
		LifeArea:   "cách bạn kết nối với nội tâm tĩnh lặng, buông bỏ những nghiệp quả cũ và tìm thấy sự bình an tinh thần",
		Strengths:  "lòng từ bi sâu sắc, trực giác tâm linh thấu thị, khả năng chữa lành và tâm hồn nghệ thuật phong phú",
		Challenges: "xu hướng trốn tránh thực tại, cảm giác mơ hồ không rõ ràng hoặc tự đặt mình vào vai nạn nhân",
	},
}

type AspectDetail struct {
	Type        string
	ViName      string
	Quality     string
	CorePattern string
	RealPattern string
	StrPattern  string
	ChalPattern string
	Growth      string
}

var aspectDetails = []AspectDetail{
	{
		Type:        "conjunction",
		ViName:      "Trùng Tụ",
		Quality:     "sự hợp nhất mạnh mẽ",
		CorePattern: "Góc trùng tụ tạo nên sự hòa quyện tuyệt đối giữa %s (%s) và %s (%s). Hai nguồn năng lượng cùng hội tụ tại một điểm, tạo nên trọng tâm tính cách vô cùng rõ nét và mãnh liệt.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn thể hiện sự kết hợp giữa %s và %s một cách tự nhiên, đồng thời và trực diện. Mọi quyết định hay phản ứng đều mang dấu ấn hợp nhất của cả hai hành tinh.",
		StrPattern:  "Khả năng tập trung năng lượng vượt trội, sự nhất quán trong nội tâm và sức mạnh bộc lộ cá tính ấn tượng.",
		ChalPattern: "Đôi khi khó phân tách các nhu cầu khác nhau, dễ dẫn đến sự chủ quan hoặc phản ứng quá mức khi hai hành tinh cùng bị kích hoạt.",
		Growth:      "Học cách quan sát bản thân từ góc nhìn khách quan và điều hòa năng lượng để phát huy trọn vẹn sức mạnh tổng hợp.",
	},
	{
		Type:        "opposition",
		ViName:      "Đối Góc",
		Quality:     "sự đối lập và cân bằng hai cực",
		CorePattern: "Góc đối góc thiết lập trục đối kháng đòi hỏi sự dung hòa giữa %s (%s) và %s (%s). Hai nguồn năng lượng đối diện nhau như tấm gương phản chiếu, thúc đẩy quá trình học hỏi qua mối quan hệ.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn thường thấy mình đứng giữa hai chiều hướng: một bên là %s và bên kia là %s, đòi hỏi bạn phải liên tục điều chỉnh để giữ thăng bằng.",
		StrPattern:  "Tầm nhìn khách quan đa chiều, khả năng thấu hiểu tâm lý đối phương sâu sắc và năng lực đàm phán, hòa giải xuất sắc.",
		ChalPattern: "Cảm giác giằng xé nội tâm, dao động giữa hai thái cực hoặc xu hướng phóng chiếu mâu thuẫn lên những người xung quanh.",
		Growth:      "Nhận ra rằng hai nguồn năng lượng bổ sung cho nhau, học cách đứng ở vị trí trung tâm để tích hợp trọn vẹn cả hai mặt.",
	},
	{
		Type:        "trine",
		ViName:      "Tam Hợp",
		Quality:     "dòng chảy hài hòa và may mắn tự nhiên",
		CorePattern: "Góc tam hợp mang lại dòng chảy năng lượng êm ái và sự may mắn tự nhiên giữa %s (%s) và %s (%s). Hai hành tinh hỗ trợ nhau đắc lực trong cùng một nguyên tố.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn vận dụng sự kết hợp giữa %s và %s một cách trôi chảy, không tốn nhiều công sức hay gặp phải trở ngại lớn.",
		StrPattern:  "Tài năng thiên bẩm, tâm hồn an ổn, sức hút tự nhiên và khả năng gặt hái thành công thuận lợi.",
		ChalPattern: "Nguy cơ sinh ra tâm lý chủ quan, ỷ lại hoặc thiếu động lực bứt phá khi đối diện với những thử thách lớn.",
		Growth:      "Chủ động đặt ra mục tiêu cao hơn và biến các thuận lợi bẩm sinh thành thành tựu cụ thể, có giá trị lâu dài.",
	},
	{
		Type:        "square",
		ViName:      "Vuông Góc",
		Quality:     "căng thẳng và động lực bứt phá",
		CorePattern: "Góc vuông góc tạo ra sự xung đột và áp lực nội tâm giữa %s (%s) và %s (%s). Đây là nguồn động lực mạnh mẽ thúc đẩy bạn vượt qua giới hạn và trưởng thành vượt bậc.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn thường xuyên cảm nhận được sự thôi thúc phải hành động để giải quyết mâu thuẫn giữa đòi hỏi của %s và nhu cầu của %s.",
		StrPattern:  "Ý chí kiên cường, bản lĩnh kiên định trước sóng gió và khả năng biến trở ngại thành đòn bẩy vươn lên.",
		ChalPattern: "Dễ rơi vào trạng thái căng thẳng thần kinh, bực bội nội tâm hoặc xảy ra xung đột khi năng lượng chưa được chuyển hóa lành mạnh.",
		Growth:      "Học cách kiên nhẫn, bình tĩnh đón nhận áp lực và chuyển hóa sự căng thẳng thành hành động kiến tạo có kỷ luật.",
	},
	{
		Type:        "sextile",
		ViName:      "Lục Hợp",
		Quality:     "cơ hội và sự hỗ trợ nhịp nhàng",
		CorePattern: "Góc lục hợp mở ra những cơ hội phát triển thuận lợi và sự hỗ trợ nhịp nhàng giữa %s (%s) và %s (%s). Hai nguồn năng lượng tương tác kích thích tiềm năng sáng tạo.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn dễ dàng phối hợp %s với %s để tạo ra những giải pháp thông minh và nắm bắt cơ hội đúng thời điểm.",
		StrPattern:  "Tư duy linh hoạt, khả năng giao tiếp khéo léo, tinh thần ham học hỏi và năng lực thích ứng nhanh.",
		ChalPattern: "Các cơ hội có thể bị bỏ lỡ nếu bạn thiếu sự chủ động và không quyết tâm hành động kịp thời.",
		Growth:      "Chủ động tìm kiếm cơ hội mới, rèn luyện kỹ năng và kiên trì biến các ý tưởng triển vọng thành hiện thực.",
	},
	{
		Type:        "quincunx",
		ViName:      "Bất Tương",
		Quality:     "sự lệch pha đòi hỏi tái điều chỉnh liên tục",
		CorePattern: "Góc bất tương (150°) phản ánh sự tương tác giữa hai nguồn năng lượng %s (%s) và %s (%s) không có điểm tương đồng tự nhiên, đòi hỏi sự linh hoạt điều chỉnh liên tục.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn phải thường xuyên tinh chỉnh lịch trình và thái độ để %s không gây trở ngại cho %s.",
		StrPattern:  "Khả năng thích ứng cao, tính tháo vát trong giải quyết vấn đề và sự nhạy bén trước các tình huống bất ngờ.",
		ChalPattern: "Cảm giác mệt mỏi tinh thần nhẹ hoặc căng thẳng âm ỉ khi phải liên tục thay đổi để dung hòa các yếu tố lệch pha.",
		Growth:      "Học cách sắp xếp thứ tự ưu tiên rõ ràng và rèn luyện lối sống cân bằng, khoa học để bảo dưỡng năng lượng.",
	},
	{
		Type:        "semi-sextile",
		ViName:      "Bán Lục Hợp",
		Quality:     "sự tương tác tinh tế vi mô",
		CorePattern: "Góc bán lục hợp mang lại sự kết nối vi mô giữa %s (%s) và %s (%s). Hai cung liền kề thúc đẩy sự học hỏi và chuyển tiếp kinh nghiệm nhẹ nhàng.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn nhận biết rõ những khác biệt nhỏ giữa %s và %s, giúp bạn tinh chỉnh phản ứng một cách tinh tế.",
		StrPattern:  "Sự nhạy cảm với các chi tiết, khả năng quan sát sâu sắc và ứng xử khéo léo trong đời sống thường nhật.",
		ChalPattern: "Cảm giác băn khoăn nhỏ lặp đi lặp lại nếu chưa biết cách dung hòa các nhu cầu chi tiết của bản thân.",
		Growth:      "Lắng nghe những tín hiệu nhỏ từ nội tâm và kiên nhẫn tích lũy kinh nghiệm qua từng trải nghiệm hàng ngày.",
	},
	{
		Type:        "semi-square",
		ViName:      "Bán Vuông",
		Quality:     "thử thách nhỏ kích thích hành động",
		CorePattern: "Góc bán vuông (45°) tạo ra sự ma sát nhỏ nhưng thường trực giữa %s (%s) và %s (%s), nhắc nhở bạn không được lơ là mục tiêu.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn hay gặp những trở ngại vụn vặt liên quan đến %s và %s, đòi hỏi bạn phải giải quyết dứt điểm.",
		StrPattern:  "Sự tỉnh táo, khả năng phát hiện sớm các khúc mắc và tinh thần bền bỉ vượt qua khó khăn nhỏ.",
		ChalPattern: "Dễ sinh tâm lý bực dọc, mất kiên nhẫn khi gặp phải những trở ngại lặt vặt không đáng có.",
		Growth:      "Rèn luyện tính kiên trì, tập trung vào bức tranh lớn và giải quyết từng vấn đề nhỏ với thái độ điềm tĩnh.",
	},
	{
		Type:        "sesquiquadrate",
		ViName:      "Đại Bán Vuông",
		Quality:     "áp lực tích tụ thôi thúc thay đổi",
		CorePattern: "Góc đại bán vuông (135°) mang lại áp lực ngầm tích tụ giữa %s (%s) và %s (%s), thôi thúc bạn tái cấu trúc các thói quen cũ để giải phóng tiềm năng.",
		RealPattern: "Trong cuộc sống hàng ngày, bạn nhận thấy những mô thức cũ giữa %s và %s không còn phù hợp, cần một bước ngoặt thay đổi rõ rệt.",
		StrPattern:  "Năng lực tự nhìn nhận bản thân trung thực, sự quyết tâm và ý chí cải tổ mạnh mẽ.",
		ChalPattern: "Cảm giác căng thẳng kéo dài hoặc sự bùng nổ cảm xúc nếu kìm nén quá lâu mà không tìm hướng giải tỏa.",
		Growth:      "Chủ động nhận diện các tắc nghẽn tâm lý và mạnh dạn thay đổi phương pháp để tạo ra bước tiến mới vững chắc.",
	},
}

type Record struct {
	Language     string
	FactorType   string
	FactorValue1 string
	FactorValue2 string
	FactorValue3 string
	CoreMeaning  string
	RealLife     string
	Strengths    string
	Challenges   string
	Relationships string
	GrowthPath   string
	KeyThemes    []string
}

func main() {
	db, err := sqlx.Connect("postgres", "postgres://zodiac_user:zodiac_pass@localhost:5432/zodiac_db?sslmode=disable")
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	var records []Record

	// 1. Generate Planet In Sign (12 x 12 = 144)
	for _, p := range celestialBodies {
		for _, s := range zodiacSigns {
			core := fmt.Sprintf("%s đặt tại cung %s thể hiện %s qua lăng kính %s. Vị trí này mang lại %s và định hình phong cách sống độc đáo của bạn.",
				p.ViName, s.ViName, p.Domain, s.Style, s.Core)
			real := fmt.Sprintf("Trong cuộc sống hằng ngày, bạn vận dụng %s để %s. Bạn tiếp cận các tình huống thực tế với phong thái %s.",
				s.Style, p.Action, s.Core)
			str := fmt.Sprintf("Thế mạnh vượt trội đến từ sự hòa quyện giữa %s và %s, giúp bạn %s một cách hiệu quả.",
				p.Domain, s.Core, p.Action)
			chal := fmt.Sprintf("Thử thách chính là việc cần cân bằng năng lượng %s, tránh sự cực đoan và học cách %s.",
				p.ViName, s.Growth)
			rel := fmt.Sprintf("Trong các mối quan hệ, bạn thể hiện sự %s và khao khát xây dựng sự gắn kết dựa trên %s.",
				s.RelStyle, p.Domain)
			growth := fmt.Sprintf("Con đường phát triển bản thân: %s, đồng thời nuôi dưỡng %s một cách toàn diện.",
				s.Growth, p.Domain)
			themes := []string{fmt.Sprintf("%s ở %s", p.ViName, s.ViName), p.ViName, s.ViName, "Chiêm Tinh Cá Nhân"}

			records = append(records, Record{
				Language:      "vi",
				FactorType:    "planet_in_sign",
				FactorValue1:  p.EnName,
				FactorValue2:  s.EnName,
				FactorValue3:  "",
				CoreMeaning:   core,
				RealLife:      real,
				Strengths:     str,
				Challenges:    chal,
				Relationships: rel,
				GrowthPath:    growth,
				KeyThemes:     themes,
			})
		}
	}

	// 2. Generate Planet In House (12 x 12 = 144)
	for _, p := range celestialBodies {
		for _, h := range houseDetails {
			core := fmt.Sprintf("%s tọa lạc tại %s hướng nguồn năng lượng của %s vào lĩnh vực %s. Đây là môi trường sống chủ chốt nơi bạn thể hiện bản thân mạnh mẽ nhất.",
				p.ViName, h.Title, p.Domain, h.Domain)
			real := fmt.Sprintf("Trong thực tế cuộc sống, bạn dành nhiều tâm huyết và năng lượng để %s trong %s. Bạn luôn tìm cách %s tại đây.",
				p.Action, h.LifeArea, p.Action)
			str := fmt.Sprintf("Khả năng phát huy tối đa sức mạnh %s trong lĩnh vực %s, đem lại %s.",
				p.Domain, h.Domain, h.Strengths)
			chal := fmt.Sprintf("Cần lưu ý tránh %s, đồng thời học cách quản lý năng lượng %s một cách khéo léo.",
				h.Challenges, p.ViName)
			rel := fmt.Sprintf("Đối với các mối quan hệ, vị trí này thôi thúc bạn chia sẻ %s và cùng đối phương phát triển trong %s.",
				p.Domain, h.Domain)
			growth := fmt.Sprintf("Con đường tiến hóa: Biến lĩnh vực %s thành trường học rèn luyện bản lĩnh, vận dụng %s để cống hiến cho cuộc sống.",
				h.Title, p.Domain)
			themes := []string{fmt.Sprintf("%s ở Nhà %s", p.ViName, h.Number), p.ViName, fmt.Sprintf("Nhà %s", h.Number), "Cung Địa Bàn"}

			records = append(records, Record{
				Language:      "vi",
				FactorType:    "planet_in_house",
				FactorValue1:  p.EnName,
				FactorValue2:  h.Number,
				FactorValue3:  "",
				CoreMeaning:   core,
				RealLife:      real,
				Strengths:     str,
				Challenges:    chal,
				Relationships: rel,
				GrowthPath:    growth,
				KeyThemes:     themes,
			})
		}
	}

	// 3. Generate House In Sign (12 x 12 = 144)
	for _, h := range houseDetails {
		for _, s := range zodiacSigns {
			core := fmt.Sprintf("Đỉnh %s nằm tại cung %s định hình cách bạn tiếp cận lĩnh vực %s với năng lượng %s. Bạn giải quyết các vấn đề liên quan đến nhà này bằng %s.",
				h.Title, s.ViName, h.Domain, s.Style, s.Core)
			real := fmt.Sprintf("Trong cuộc sống hàng ngày, bạn thể hiện sự %s khi giải quyết %s. Mọi hoạt động trong lĩnh vực này đều mang đậm phong thái %s.",
				s.Style, h.LifeArea, s.Core)
			str := fmt.Sprintf("Sức mạnh nổi bật đến từ sự kết hợp giữa %s và %s: %s.",
				h.Domain, s.ViName, h.Strengths)
			chal := fmt.Sprintf("Thử thách cần lưu ý: %s, đồng thời cần chú ý %s.",
				h.Challenges, s.Growth)
			rel := fmt.Sprintf("Trong các mối quan hệ gắn với lĩnh vực này, bạn thể hiện sự %s và khao khát duy trì sự hòa hợp.",
				s.RelStyle)
			growth := fmt.Sprintf("Con đường phát triển: %s, hướng tới sự trưởng thành và thành công bền vững trong lĩnh vực %s.",
				s.Growth, h.Title)
			themes := []string{fmt.Sprintf("Nhà %s ở %s", h.Number, s.ViName), fmt.Sprintf("Nhà %s", h.Number), s.ViName, "Đỉnh Nhà"}

			records = append(records, Record{
				Language:      "vi",
				FactorType:    "house_in_sign",
				FactorValue1:  h.Number,
				FactorValue2:  s.EnName,
				FactorValue3:  "",
				CoreMeaning:   core,
				RealLife:      real,
				Strengths:     str,
				Challenges:    chal,
				Relationships: rel,
				GrowthPath:    growth,
				KeyThemes:     themes,
			})
		}
	}

	// 4. Generate Aspects (66 pairs x 9 aspect types = 594)
	planetMap := make(map[string]CelestialBody)
	for _, b := range celestialBodies {
		planetMap[b.EnName] = b
	}

	for i := 0; i < len(celestialBodies); i++ {
		for j := i + 1; j < len(celestialBodies); j++ {
			p1Raw := celestialBodies[i].EnName
			p2Raw := celestialBodies[j].EnName

			// Ensure alphabetical order for DB key matching
			pair := []string{p1Raw, p2Raw}
			sort.Strings(pair)
			p1Name := pair[0]
			p2Name := pair[1]

			b1 := planetMap[p1Name]
			b2 := planetMap[p2Name]

			for _, a := range aspectDetails {
				core := fmt.Sprintf(a.CorePattern, b1.ViName, b1.Domain, b2.ViName, b2.Domain)
				real := fmt.Sprintf(a.RealPattern, b1.ViName, b2.ViName)
				str := fmt.Sprintf("%s (%s phối hợp cùng %s)", a.StrPattern, b1.ViName, b2.ViName)
				chal := fmt.Sprintf("%s (Xảy ra giữa %s và %s)", a.ChalPattern, b1.ViName, b2.ViName)
				rel := fmt.Sprintf("Trong chuyện tình cảm và các mối quan hệ hợp tác, góc chiếu %s giữa %s và %s thể hiện sự tương tác sâu sắc, đòi hỏi sự thấu hiểu và chia sẻ chân thành giữa hai bên.",
					a.ViName, b1.ViName, b2.ViName)
				growth := fmt.Sprintf("Bài học phát triển: %s Vận dụng năng lượng của %s để bổ trợ cho %s một cách hài hòa và tỉnh thức.",
					a.Growth, b1.ViName, b2.ViName)
				themes := []string{fmt.Sprintf("Góc %s", a.ViName), b1.ViName, b2.ViName, "Góc Chiếu Chiêm Tinh"}

				records = append(records, Record{
					Language:      "vi",
					FactorType:    "aspect",
					FactorValue1:  p1Name,
					FactorValue2:  p2Name,
					FactorValue3:  a.Type,
					CoreMeaning:   core,
					RealLife:      real,
					Strengths:     str,
					Challenges:    chal,
					Relationships: rel,
					GrowthPath:    growth,
					KeyThemes:     themes,
				})
			}
		}
	}

	fmt.Printf("Generated %d total Vietnamese records. Inserting into database...\n", len(records))

	tx, err := db.Beginx()
	if err != nil {
		log.Fatalf("Failed to begin transaction: %v", err)
	}

	// Delete old Vietnamese interpretations to avoid lingering partial/English records
	_, err = tx.Exec("DELETE FROM placement_interpretations WHERE language = 'vi'")
	if err != nil {
		tx.Rollback()
		log.Fatalf("Failed to clear old Vietnamese interpretations: %v", err)
	}

	insertQuery := `
		INSERT INTO placement_interpretations (
			language, factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
		)
	`

	stmt, err := tx.Preparex(insertQuery)
	if err != nil {
		tx.Rollback()
		log.Fatalf("Failed to prepare statement: %v", err)
	}
	defer stmt.Close()

	for idx, r := range records {
		_, err := stmt.Exec(
			r.Language,
			r.FactorType,
			r.FactorValue1,
			r.FactorValue2,
			r.FactorValue3,
			r.CoreMeaning,
			r.RealLife,
			r.Strengths,
			r.Challenges,
			r.Relationships,
			r.GrowthPath,
			pq.Array(r.KeyThemes),
		)
		if err != nil {
			tx.Rollback()
			log.Fatalf("Failed at row %d (%s - %s - %s - %s): %v", idx, r.FactorType, r.FactorValue1, r.FactorValue2, r.FactorValue3, err)
		}
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("Failed to commit transaction: %v", err)
	}

	fmt.Printf("SUCCESS: Successfully inserted %d pure Vietnamese interpretations into placement_interpretations!\n", len(records))
}
