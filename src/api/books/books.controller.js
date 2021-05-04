const Book = require("models/book");
const Joi = require("joi");
const {
  Types: { objectId },
} = require("mongoose");

exports.get = async (ctx) => {
  const { id } = ctx.params;
  let book;
  try {
    book = await Book.findById(id).exec();
  } catch (e) {
    if (e.name === "CastError") {
      ctx.status = 400;
      return;
    }
    return ctx.throw(500, e);
  }
  if (!book) {
    ctx.status = 404;
    ctx.body = { message: "book not found" };
  }
  ctx.body = book;
};
exports.list = async (ctx) => {
  let books;

  try {
    books = await Book.find()
      .sort({ _id: -1 }) //_id 의 역순으로 정렬
      .limit(3) //3개만 보여지도록 정렬
      .exec(); //데이터를 서버에 요청
  } catch (e) {
    return ctx.throw(500, e);
  }
  ctx.body = books;
};

exports.create = async (ctx) => {
  const { title, authors, publishedDate, price, tags } = ctx.request.body;

  const book = new Book({
    title,
    authors,
    publishedDate,
    price,
    tags,
  });
  try {
    await book.save();
  } catch (e) {
    return ctx.throw(500, e);
  }
  ctx.body = book;
};

exports.delete = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Book.findByIdAndRemove(id).exec();
  } catch (e) {
    if (e.name === "CastError") {
      ctx.status = 400;
      return;
    }
  }
  ctx.status = 204;
};

exports.replace = async (ctx) => {
  const { id } = ctx.params;

  if (!objectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    authors: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      })
    ),
    publishedDate: Joi.date().required(),
    price: Joi.number().required(),
    tags: Joi.array().items(Joi.string().required()),
  });
  const result = Joi.validate(ctx.requeest.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  let book;

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      upsert: true, //이 값을 넣어주면 데이터가 존재하지 않으면 새로 만들어진다.
      new: true, //이값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다. 이 값이 없으면 ctx.body = book 했을때 업데이트 전의 데이터를 보여줌
    });
  } catch (e) {
    return ctx.throw(500, e);
  }
  ctx.body = book;
};

exports.update = async (ctx) => {
  const { id } = ctx.params;

  if (!objectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  let book;

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    });
  } catch (e) {
    return ctx.throw(500, e);
  }
  ctx.body = book;
};
