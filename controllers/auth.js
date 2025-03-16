import bcrypt from "bcrypt";
import db from "../connect.js";
import jwt from "jsonwebtoken";

// dang ky tai khoan
export const register = (req, res) => {
  // check if user exists
  const q = "SELECT * FROM users WHERE username = $1";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.rows.length) return res.status(409).json("User already exists");

    // create a new user
    // hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (username, email, password, name) VALUES ($1, $2, $3, $4)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name
    ];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json({ Error : err });
      return res.status(201).json({ message: "User created" });
    });
  });
};

// dang nhap
export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = $1";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (!data.rows.length) return res.status(404).json("Wrong password or username!");

        // check if password is correct
        const checkPassword = bcrypt.compareSync(req.body.password, data.rows[0].password);
        if (!checkPassword) return res.status(400).json("Wrong password or username!");

        const token = jwt.sign({ id: data.rows[0].id }, process.env.SECRET_KEY);

        const { password, ...others } = data.rows[0];

        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(others);
    });
};

// dang xuat
export const logout = (req, res) => {
    res.clearCookie("access_token",{
        secure: true,
        sameSite: "none",
    }).status(200).json("Logged out");
};
