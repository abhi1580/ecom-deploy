const Product = require("../../models/Product");
const getFilteredProducts = async (req, res) => {
  try {
    const {
      category = "",
      brand = "",
      sortBy = "price-lowtohigh",
      limit = 10, // Default limit
      page = 1, // Default page
    } = req.query;

    let filters = {};

    if (category) {
      filters.category = { $in: category.split(",").filter(Boolean) };
    }

    if (brand) {
      filters.brand = { $in: brand.split(",").filter(Boolean) };
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const totalProducts = await Product.countDocuments(filters);

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    // Calculate the range of products displayed
    const startProduct = skip + 1;
    const endProduct = Math.min(skip + limitNumber, totalProducts);

    res.status(200).json({
      success: true,
      data: products,
      totalPages,
      currentPage: pageNumber,
      totalProducts,
      showing: `Showing ${startProduct}-${endProduct} of ${totalProducts} products`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
