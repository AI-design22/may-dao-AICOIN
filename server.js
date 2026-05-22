const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = "8948917406:AAEkk2MEZ1WzlanSu0P7r5EY5zjMYyAfLY4";

// Đây là đường dẫn Webhook mà Telegram sẽ gửi dữ liệu về khi bạn bấm nút
app.post('/webhook', async (req, res) => {
    const data = req.body;

    if (data.callback_query) {
        const callbackData = data.callback_query.data;
        const queryId = data.callback_query.id;

        // Nếu Admin bấm nút có callback_data bắt đầu bằng "approve_"
        if (callbackData.startsWith("approve_")) {
            const userId = callbackData.split("_")[1]; // Lấy ID người dùng từ nút bấm

            try {
                // 1. Bot gửi tin nhắn riêng cho người dùng (DM)
                await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                    chat_id: userId,
                    text: "✅ ĐƠN RÚT TIỀN CỦA BẠN ĐÃ ĐƯỢC DUYỆT!\n💰 Admin đã chuyển khoản thành công vào tài khoản của bạn."
                });

                // 2. Thông báo cho Admin biết là đã xử lý xong (hiện popup nhỏ trên Telegram)
                await axios.post(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
                    callback_query_id: queryId,
                    text: "ĐÃ DUYỆT THÀNH CÔNG!"
                });

                console.log(`Đã duyệt cho user: ${userId}`);
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error.message);
            }
        }
    }
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy tại port ${PORT}`));