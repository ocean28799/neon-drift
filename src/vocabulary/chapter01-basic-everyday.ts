// Chapter 1: Basic Everyday Words (100 Essential Words)
// The most fundamental words used in daily conversation

export interface LanguageWord {
  id: string
  english: string
  vietnamese: string
  pronunciation: string
  category: string
  difficulty: number
  chapter: string
  examples?: string[]
  synonym?: string
  antonym?: string
}

export const chapter01Words: LanguageWord[] = [
  // Greetings & Politeness (20 words)
  { id: 'basic1', english: 'Hello', vietnamese: 'Xin chào', pronunciation: 'sin chow', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['Hello, how are you?'] },
  { id: 'basic2', english: 'Goodbye', vietnamese: 'Tạm biệt', pronunciation: 'tam biet', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['Goodbye, see you later!'] },
  { id: 'basic3', english: 'Thank you', vietnamese: 'Cảm ơn', pronunciation: 'gam un', category: 'politeness', chapter: 'chapter01', difficulty: 1, examples: ['Thank you very much!'] },
  { id: 'basic4', english: 'Please', vietnamese: 'Làm ơn', pronunciation: 'lam un', category: 'politeness', chapter: 'chapter01', difficulty: 1, examples: ['Please help me.'] },
  { id: 'basic5', english: 'Sorry', vietnamese: 'Xin lỗi', pronunciation: 'sin loy', category: 'politeness', chapter: 'chapter01', difficulty: 1, examples: ['Sorry for being late.'] },
  { id: 'basic6', english: 'Excuse me', vietnamese: 'Xin lỗi', pronunciation: 'sin loy', category: 'politeness', chapter: 'chapter01', difficulty: 1, examples: ['Excuse me, where is the bathroom?'] },
  { id: 'basic7', english: 'Welcome', vietnamese: 'Chào mừng', pronunciation: 'chow mung', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['Welcome to our home!'] },
  { id: 'basic8', english: 'Good morning', vietnamese: 'Chào buổi sáng', pronunciation: 'chow buoy sang', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['Good morning everyone!'] },
  { id: 'basic9', english: 'Good night', vietnamese: 'Chúc ngủ ngon', pronunciation: 'chuc ngu ngon', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['Good night, sweet dreams!'] },
  { id: 'basic10', english: 'How are you', vietnamese: 'Bạn khỏe không', pronunciation: 'ban khoe khong', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['How are you today?'] },
  { id: 'basic11', english: 'Fine', vietnamese: 'Khỏe', pronunciation: 'khoe', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['I am fine, thank you.'] },
  { id: 'basic12', english: 'Nice to meet you', vietnamese: 'Rất vui được gặp', pronunciation: 'rat vui duoc gap', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['Nice to meet you!'] },
  { id: 'basic13', english: 'See you later', vietnamese: 'Hẹn gặp lại', pronunciation: 'hen gap lai', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['See you later tonight!'] },
  { id: 'basic14', english: 'Take care', vietnamese: 'Bảo trọng', pronunciation: 'bao trong', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['Take care of yourself!'] },
  { id: 'basic15', english: 'You are welcome', vietnamese: 'Không có gì', pronunciation: 'khong co gi', category: 'politeness', chapter: 'chapter01', difficulty: 1, examples: ['You are welcome, anytime!'] },
  { id: 'basic16', english: 'Pardon', vietnamese: 'Xin lỗi', pronunciation: 'sin loy', category: 'politeness', chapter: 'chapter01', difficulty: 1, examples: ['Pardon me, I did not hear.'] },
  { id: 'basic17', english: 'Bless you', vietnamese: 'Cầu chúc', pronunciation: 'cau chuc', category: 'politeness', chapter: 'chapter01', difficulty: 1, examples: ['Bless you! (after sneezing)'] },
  { id: 'basic18', english: 'Congratulations', vietnamese: 'Chúc mừng', pronunciation: 'chuc mung', category: 'politeness', chapter: 'chapter01', difficulty: 1, examples: ['Congratulations on your success!'] },
  { id: 'basic19', english: 'Happy birthday', vietnamese: 'Chúc mừng sinh nhật', pronunciation: 'chuc mung sinh nhat', category: 'greeting', chapter: 'chapter01', difficulty: 1, examples: ['Happy birthday to you!'] },
  { id: 'basic20', english: 'Good luck', vietnamese: 'Chúc may mắn', pronunciation: 'chuc may man', category: 'politeness', chapter: 'chapter01', difficulty: 1, examples: ['Good luck with your exam!'] },

  // Basic Responses (15 words)
  { id: 'basic21', english: 'Yes', vietnamese: 'Có', pronunciation: 'go', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['Yes, I agree.'], antonym: 'No' },
  { id: 'basic22', english: 'No', vietnamese: 'Không', pronunciation: 'khong', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['No, I disagree.'], antonym: 'Yes' },
  { id: 'basic23', english: 'Maybe', vietnamese: 'Có thể', pronunciation: 'go the', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['Maybe we can go tomorrow.'] },
  { id: 'basic24', english: 'Sure', vietnamese: 'Chắc chắn', pronunciation: 'chac chan', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['Sure, I will help you.'] },
  { id: 'basic25', english: 'Of course', vietnamese: 'Tất nhiên', pronunciation: 'tat nhien', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['Of course, no problem!'] },
  { id: 'basic26', english: 'Okay', vietnamese: 'Được rồi', pronunciation: 'duoc roy', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['Okay, let us go.'] },
  { id: 'basic27', english: 'Alright', vietnamese: 'Được thôi', pronunciation: 'duoc thoy', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['Alright, I understand.'] },
  { id: 'basic28', english: 'Exactly', vietnamese: 'Chính xác', pronunciation: 'chinh xac', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['Exactly what I meant!'] },
  { id: 'basic29', english: 'Absolutely', vietnamese: 'Hoàn toàn', pronunciation: 'hoan toan', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['Absolutely correct!'] },
  { id: 'basic30', english: 'Never mind', vietnamese: 'Không sao', pronunciation: 'khong sao', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['Never mind, it is okay.'] },
  { id: 'basic31', english: 'I see', vietnamese: 'Tôi hiểu', pronunciation: 'toy hieu', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['I see what you mean.'] },
  { id: 'basic32', english: 'I know', vietnamese: 'Tôi biết', pronunciation: 'toy biet', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['I know the answer.'] },
  { id: 'basic33', english: 'I understand', vietnamese: 'Tôi hiểu', pronunciation: 'toy hieu', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['I understand your problem.'] },
  { id: 'basic34', english: 'I agree', vietnamese: 'Tôi đồng ý', pronunciation: 'toy dong y', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['I agree with your idea.'] },
  { id: 'basic35', english: 'No problem', vietnamese: 'Không vấn đề', pronunciation: 'khong van de', category: 'response', chapter: 'chapter01', difficulty: 1, examples: ['No problem, I can do it.'] },

  // Basic Adjectives (20 words)
  { id: 'basic36', english: 'Good', vietnamese: 'Tốt', pronunciation: 'tot', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['This is good.'], antonym: 'Bad' },
  { id: 'basic37', english: 'Bad', vietnamese: 'Xấu', pronunciation: 'sau', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['The weather is bad.'], antonym: 'Good' },
  { id: 'basic38', english: 'Big', vietnamese: 'To', pronunciation: 'to', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['A big house.'], antonym: 'Small' },
  { id: 'basic39', english: 'Small', vietnamese: 'Nhỏ', pronunciation: 'nyo', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['A small car.'], antonym: 'Big' },
  { id: 'basic40', english: 'Hot', vietnamese: 'Nóng', pronunciation: 'nong', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['Hot weather.'], antonym: 'Cold' },
  { id: 'basic41', english: 'Cold', vietnamese: 'Lạnh', pronunciation: 'lanh', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['Cold water.'], antonym: 'Hot' },
  { id: 'basic42', english: 'Fast', vietnamese: 'Nhanh', pronunciation: 'nyah', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['Drive fast.'], antonym: 'Slow' },
  { id: 'basic43', english: 'Slow', vietnamese: 'Chậm', pronunciation: 'chahm', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['Walk slowly.'], antonym: 'Fast' },
  { id: 'basic44', english: 'New', vietnamese: 'Mới', pronunciation: 'moy', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['A new phone.'], antonym: 'Old' },
  { id: 'basic45', english: 'Old', vietnamese: 'Cũ', pronunciation: 'goo', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['An old book.'], antonym: 'New' },
  { id: 'basic46', english: 'High', vietnamese: 'Cao', pronunciation: 'kao', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['High mountain.'], antonym: 'Low' },
  { id: 'basic47', english: 'Low', vietnamese: 'Thấp', pronunciation: 'thap', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['Low price.'], antonym: 'High' },
  { id: 'basic48', english: 'Easy', vietnamese: 'Dễ', pronunciation: 'ze', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['This is easy.'], antonym: 'Hard' },
  { id: 'basic49', english: 'Hard', vietnamese: 'Khó', pronunciation: 'kho', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['Math is hard.'], antonym: 'Easy' },
  { id: 'basic50', english: 'Long', vietnamese: 'Dài', pronunciation: 'dai', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['A long road.'], antonym: 'Short' },
  { id: 'basic51', english: 'Short', vietnamese: 'Ngắn', pronunciation: 'ngan', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['Short hair.'], antonym: 'Long' },
  { id: 'basic52', english: 'Beautiful', vietnamese: 'Đẹp', pronunciation: 'dep', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['Beautiful flowers.'], antonym: 'Ugly' },
  { id: 'basic53', english: 'Ugly', vietnamese: 'Xấu', pronunciation: 'sau', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['Ugly building.'], antonym: 'Beautiful' },
  { id: 'basic54', english: 'Happy', vietnamese: 'Vui', pronunciation: 'vui', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['I am happy.'], antonym: 'Sad' },
  { id: 'basic55', english: 'Sad', vietnamese: 'Buồn', pronunciation: 'buon', category: 'adjective', chapter: 'chapter01', difficulty: 1, examples: ['She looks sad.'], antonym: 'Happy' },

  // Basic Directions & Positions (15 words)
  { id: 'basic56', english: 'Left', vietnamese: 'Trái', pronunciation: 'chai', category: 'direction', chapter: 'chapter01', difficulty: 1, examples: ['Turn left.'], antonym: 'Right' },
  { id: 'basic57', english: 'Right', vietnamese: 'Phải', pronunciation: 'fai', category: 'direction', chapter: 'chapter01', difficulty: 1, examples: ['Turn right.'], antonym: 'Left' },
  { id: 'basic58', english: 'Up', vietnamese: 'Lên', pronunciation: 'len', category: 'direction', chapter: 'chapter01', difficulty: 1, examples: ['Go up the stairs.'], antonym: 'Down' },
  { id: 'basic59', english: 'Down', vietnamese: 'Xuống', pronunciation: 'xuong', category: 'direction', chapter: 'chapter01', difficulty: 1, examples: ['Come down here.'], antonym: 'Up' },
  { id: 'basic60', english: 'Here', vietnamese: 'Đây', pronunciation: 'day', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Come here please.'], antonym: 'There' },
  { id: 'basic61', english: 'There', vietnamese: 'Đó', pronunciation: 'do', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Put it there.'], antonym: 'Here' },
  { id: 'basic62', english: 'Near', vietnamese: 'Gần', pronunciation: 'gan', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Near the school.'], antonym: 'Far' },
  { id: 'basic63', english: 'Far', vietnamese: 'Xa', pronunciation: 'xa', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Far from home.'], antonym: 'Near' },
  { id: 'basic64', english: 'Inside', vietnamese: 'Trong', pronunciation: 'trong', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Inside the house.'], antonym: 'Outside' },
  { id: 'basic65', english: 'Outside', vietnamese: 'Ngoài', pronunciation: 'ngoai', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Outside the building.'], antonym: 'Inside' },
  { id: 'basic66', english: 'Front', vietnamese: 'Trước', pronunciation: 'truoc', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['In front of the store.'], antonym: 'Back' },
  { id: 'basic67', english: 'Back', vietnamese: 'Sau', pronunciation: 'sau', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Behind the house.'], antonym: 'Front' },
  { id: 'basic68', english: 'Next to', vietnamese: 'Bên cạnh', pronunciation: 'ben canh', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Next to the bank.'] },
  { id: 'basic69', english: 'Between', vietnamese: 'Giữa', pronunciation: 'giua', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Between two trees.'] },
  { id: 'basic70', english: 'Around', vietnamese: 'Xung quanh', pronunciation: 'xung quanh', category: 'position', chapter: 'chapter01', difficulty: 1, examples: ['Walk around the park.'] },

  // Basic Time Words (15 words)
  { id: 'basic71', english: 'Now', vietnamese: 'Bây giờ', pronunciation: 'bay gio', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Do it now.'] },
  { id: 'basic72', english: 'Later', vietnamese: 'Sau này', pronunciation: 'sau nay', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['See you later.'] },
  { id: 'basic73', english: 'Before', vietnamese: 'Trước', pronunciation: 'truoc', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Before dinner.'], antonym: 'After' },
  { id: 'basic74', english: 'After', vietnamese: 'Sau', pronunciation: 'sau', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['After work.'], antonym: 'Before' },
  { id: 'basic75', english: 'Today', vietnamese: 'Hôm nay', pronunciation: 'hom nay', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Today is sunny.'] },
  { id: 'basic76', english: 'Tomorrow', vietnamese: 'Ngày mai', pronunciation: 'ngay mai', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Tomorrow is Monday.'] },
  { id: 'basic77', english: 'Yesterday', vietnamese: 'Hôm qua', pronunciation: 'hom qua', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Yesterday was fun.'] },
  { id: 'basic78', english: 'Always', vietnamese: 'Luôn luôn', pronunciation: 'luon luon', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['I always study.'], antonym: 'Never' },
  { id: 'basic79', english: 'Never', vietnamese: 'Không bao giờ', pronunciation: 'khong bao gio', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Never give up.'], antonym: 'Always' },
  { id: 'basic80', english: 'Sometimes', vietnamese: 'Thỉnh thoảng', pronunciation: 'thinh thoang', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Sometimes I cook.'] },
  { id: 'basic81', english: 'Often', vietnamese: 'Thường xuyên', pronunciation: 'thuong xuyen', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['I often read books.'] },
  { id: 'basic82', english: 'Usually', vietnamese: 'Thường', pronunciation: 'thuong', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Usually I wake up early.'] },
  { id: 'basic83', english: 'Early', vietnamese: 'Sớm', pronunciation: 'som', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Come early tomorrow.'], antonym: 'Late' },
  { id: 'basic84', english: 'Late', vietnamese: 'Muộn', pronunciation: 'muon', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['Sorry I am late.'], antonym: 'Early' },
  { id: 'basic85', english: 'Soon', vietnamese: 'Sớm', pronunciation: 'som', category: 'time', chapter: 'chapter01', difficulty: 1, examples: ['I will be there soon.'] },

  // Basic Quantities & Numbers (15 words)
  { id: 'basic86', english: 'Much', vietnamese: 'Nhiều', pronunciation: 'nhieu', category: 'quantity', chapter: 'chapter01', difficulty: 1, examples: ['Too much food.'], antonym: 'Little' },
  { id: 'basic87', english: 'Little', vietnamese: 'Ít', pronunciation: 'it', category: 'quantity', chapter: 'chapter01', difficulty: 1, examples: ['A little water.'], antonym: 'Much' },
  { id: 'basic88', english: 'Many', vietnamese: 'Nhiều', pronunciation: 'nhieu', category: 'quantity', chapter: 'chapter01', difficulty: 1, examples: ['Many people.'], antonym: 'Few' },
  { id: 'basic89', english: 'Few', vietnamese: 'Ít', pronunciation: 'it', category: 'quantity', chapter: 'chapter01', difficulty: 1, examples: ['Few students.'], antonym: 'Many' },
  { id: 'basic90', english: 'All', vietnamese: 'Tất cả', pronunciation: 'tat ca', category: 'quantity', chapter: 'chapter01', difficulty: 1, examples: ['All students passed.'], antonym: 'None' },
  { id: 'basic91', english: 'Some', vietnamese: 'Một số', pronunciation: 'mot so', category: 'quantity', chapter: 'chapter01', difficulty: 1, examples: ['Some people like coffee.'] },
  { id: 'basic92', english: 'None', vietnamese: 'Không có', pronunciation: 'khong co', category: 'quantity', chapter: 'chapter01', difficulty: 1, examples: ['None of them came.'], antonym: 'All' },
  { id: 'basic93', english: 'One', vietnamese: 'Một', pronunciation: 'mot', category: 'number', chapter: 'chapter01', difficulty: 1, examples: ['One apple.'] },
  { id: 'basic94', english: 'Two', vietnamese: 'Hai', pronunciation: 'hai', category: 'number', chapter: 'chapter01', difficulty: 1, examples: ['Two books.'] },
  { id: 'basic95', english: 'Three', vietnamese: 'Ba', pronunciation: 'ba', category: 'number', chapter: 'chapter01', difficulty: 1, examples: ['Three cars.'] },
  { id: 'basic96', english: 'Four', vietnamese: 'Bốn', pronunciation: 'bon', category: 'number', chapter: 'chapter01', difficulty: 1, examples: ['Four chairs.'] },
  { id: 'basic97', english: 'Five', vietnamese: 'Năm', pronunciation: 'nam', category: 'number', chapter: 'chapter01', difficulty: 1, examples: ['Five dollars.'] },
  { id: 'basic98', english: 'First', vietnamese: 'Đầu tiên', pronunciation: 'dau tien', category: 'number', chapter: 'chapter01', difficulty: 1, examples: ['First place.'], antonym: 'Last' },
  { id: 'basic99', english: 'Last', vietnamese: 'Cuối cùng', pronunciation: 'cuoi cung', category: 'number', chapter: 'chapter01', difficulty: 1, examples: ['Last chance.'], antonym: 'First' },
  { id: 'basic100', english: 'More', vietnamese: 'Nhiều hơn', pronunciation: 'nhieu hon', category: 'quantity', chapter: 'chapter01', difficulty: 1, examples: ['I need more time.'], antonym: 'Less' }
]
