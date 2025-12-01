import mongoose from "mongoose";
import { NewsModel } from "#models/index.js";
import { connectionString } from "#config/index.js";

const categories = [
  { label: "Tin tức - Sự kiện", value: "tin-tuc-su-kien" },
  { label: "Quản lý xã Lạc Dương", value: "xa-lac-duong" },
  { label: "Quản lý xã Đạ Tẻh", value: "xa-da-teh" },
  { label: "Quản lý xã Bảo Lâm 3", value: "xa-bao-lam-3" },
  { label: "Quản lý xã Đinh Trang Thượng", value: "xa-dinh-trang-thuong" },
  { label: "Quản lý xã Đam Rông 4", value: "xa-dam-dong-4" },
];

const imageUrl = "/tin-tuc-su-kien/1764272934235-image-content-d9263feb-2c85-4fac-85a2-69ed0f81fb4b.jpg";

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function init() {
  try {
    console.log("⏳ Kết nối MongoDB...");
    await mongoose.connect(connectionString);

    const list = [];

    categories.forEach(cat => {
      for (let i = 1; i <= 50; i++) {
        const title = `${cat.label} - Bài viết số ${i}`;
        const slug = slugify(title);

        list.push({
          location: cat.value,
          slugify: slug,
          title,
          subtitle: `Phụ đề cho ${title}`,
          status: "active",
          author: "Seeder hệ thống",
          contents: [
            {
              id: 1,
              type: "content",
              text: `Đây là nội dung mẫu cho bài viết ${i} thuộc ${cat.label}.`
            },
            {
              id: 2,
              type: "image",
              mimeType: "image/jpeg",
              fileName: "default.jpg",
              size: 123456,
              url: imageUrl
            }
          ]
        });
      }
    });

    console.log(`⏳ Đang lưu ${list.length} bài...`);
    await NewsModel.insertMany(list);

    console.log("✔ Seed thành công!");
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
  } finally {
    await mongoose.connection.close();
  }
}

init();
