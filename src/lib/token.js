const jwtScret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
/**
 * JWT 토큰 생성
 * @param {any} payload
 * @returns {string} token
 */

function generateToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtScret,
      {
        expiresIn: "7d", //7일동안 유효
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}

function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtScret, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
}

exports.jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get("access_token"); //ctx에서 access_token을 읽어옵니다.
  if (!token) return next(); //토큰이 없으면 바로 다음 작업을 진행

  try {
    const decoded = await decodeToken(token); //토큰 디코딩

    //토큰 만료일이 하루밖에 안남으면 토큰을 재발급합니다,
    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      const { _id, profile } = decoded;
      const freshToken = await generateToken({ _id, profile }, "account");
      ctx.cookies.set("access_token", freshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
        httpOnly: true,
      });
    }
    //ctx.request.user에 디코딩된 값을 넣어줍니다.
    ctx.request.user = decoded;
  } catch (e) {
    //token validate 실패
    ctx.request.user = null;
  }
  return next();
};
exports.generateToken = generateToken;
