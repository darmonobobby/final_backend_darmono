const { Bookmark, Movie } = require("../models");
const NotFoundError = require("../errors/NotFoundError");

exports.create = async (req, res, next) => {
    const movieId  = req.params.id;
    const userId = req.user.id;    
    try {
        const movie = await Movie.findByPk(movieId);
        if (!movie) throw new NotFoundError("Movie Not Found");

        const [bookmark, created] = await Bookmark.findOrCreate({
          where: { movieId, userId },
          defaults: { movieId, userId }, 
          include: [{
            model: Movie,
            as: 'movie',
            attributes: ['title']
          }]
        });
    
        if (!created) {
            return res.status(200).json({
                message: "You've Bookmarked this Movie",
                data: {
                  id: bookmark.id,
                  userId: bookmark.userId,
                  movieId: bookmark.movieId,
                  movieTitle: bookmark.movie.title 
                }
            });
        }
    
        res.status(201).json({
            message: "success adding new Bookmark",
            data: {
              id: bookmark.id,
              userId: bookmark.userId,
              movieId: bookmark.movieId,
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