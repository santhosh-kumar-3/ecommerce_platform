const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

exports.createProduct = async (req, res) => {
  try {
    const { category, name, description, price, makingPrice } = req.body;

    if (!req.files || !req.files.mainImage || !req.files.subImages) {
      return res
        .status(400)
        .json({ message: "Main image and sub images are required" });
    }

    // Upload mainImage
    const mainImageUpload = await cloudinary.uploader.upload(
      req.files.mainImage[0].path
    );

    // Upload subImages (2 to 4)
    if (req.files.subImages.length < 2 || req.files.subImages.length > 4) {
      return res
        .status(400)
        .json({ message: "Sub images must be between 2 to 4" });
    }
    const subImageUploads = await Promise.all(
      req.files.subImages.map((file) => cloudinary.uploader.upload(file.path))
    );

    const product = new Product({
      category,
      name,
      description,
      price,
      makingPrice,
      mainImage: mainImageUpload.secure_url,
      subImages: subImageUploads.map((img) => img.secure_url),
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { category, name, description, price, makingPrice } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (category) product.category = category;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (makingPrice) product.makingPrice = makingPrice;

    // Update images if provided
    if (req.files && req.files.mainImage) {
      const mainImageUpload = await cloudinary.uploader.upload(
        req.files.mainImage[0].path
      );
      product.mainImage = mainImageUpload.secure_url;
    }

    if (req.files && req.files.subImages) {
      if (req.files.subImages.length < 2 || req.files.subImages.length > 4) {
        return res
          .status(400)
          .json({ message: "Sub images must be between 2 to 4" });
      }
      const subImageUploads = await Promise.all(
        req.files.subImages.map((file) => cloudinary.uploader.upload(file.path))
      );
      product.subImages = subImageUploads.map((img) => img.secure_url);
    }

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId }).populate(
      "category"
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.query || "";

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    }).populate("category");

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
