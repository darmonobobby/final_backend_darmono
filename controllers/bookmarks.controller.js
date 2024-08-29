const { Bookmark, Movie } = require("../models");
const NotFoundError = require("../errors/NotFoundError");

exports.create = async (req, res, next) => {
    const movieId  = req.params.id;
    const userId = req.user.id;    
    try {
        const movie = await Movie.findByPk(movieId);
        if (!movie) throw new NotFoundError("Movie Not Found");

        const existingBookmark = await Bookmark.findOne({ where: { movieId, userId } });
        if (!existingBookmark) {
            const bookmark = await Bookmark.create({ movieId, userId });
            return res.status(201).json({
                message: "success adding new Bookmark", 
                data: { 
                    id: bookmark.id,
                    userId: bookmark.userId,
                    movieId: bookmark.movieId,
                    movieTitle: movie.title
                } 
            });
        }
        res.status(409).json({
            message: "Bookmark already exists", 
            data: { 
                id: existingBookmark.id,
                userId: existingBookmark.userId,
                movieId: existingBookmark.movieId,
                movieTitle: movie.title
            } 
        });
    } catch (error) {
      next(error);
    }
  };

  exports.index = async (req, res, next) => {
    const options = {
        include: ["movie"],
    };
  
    options.where = {
        userId: req.user.id,
    };
  
    try {
        const bookmarks = await Bookmark.findAll(options);
        if (!bookmarks.length) throw new NotFoundError();
        res.status(200).json(bookmarks);
    } catch (error) {
        next(error);
    }
  };