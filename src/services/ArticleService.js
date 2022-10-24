const { Article, TicketType, User } = require('../models/index');
const { BadRequestError } = require('../errors');
const TicketTypeService = require('./TicketTypeService');
const ticketTypeService = new TicketTypeService();

class ArticleService {
  async getArticles(idCompany, page = 0, rowsPerPage = 10) {
    try {
      const { rows: data = [], count } = await Article.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        include: [
          {
            model: User,
            as: 'creator',
            where: { idCompany },
            attributes: ['id', 'name', 'lastName'],
          },
          {
            model: TicketType,
            as: 'type',
          },
        ],
        where: {
          active: true,
        },
        order: [['createdAt', 'DESC']],
      });
      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getArticlesByType(idCompany, idType) {
    try {
      const articles = await Article.findAll({
        include: [
          {
            model: User,
            as: 'creator',
            where: { idCompany },
            attributes: ['id', 'name', 'lastName'],
          },
          {
            model: TicketType,
            as: 'type',
          },
        ],
        where: {
          idType,
          active: true,
        },
        order: [['createdAt', 'DESC']],
      });
      return articles;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getArticleById(id) {
    try {
      const article = await Article.findOne({
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'lastName'],
          },
          {
            model: TicketType,
            as: 'type',
          },
        ],
        where: {
          id,
          active: true,
        },
      });
      return article;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addArticle(idUser, articleDTO) {
    try {
      const type = await ticketTypeService.get(articleDTO.type);
      const article = await Article.create({
        title: articleDTO.title,
        text: articleDTO.text,
        createdBy: idUser,
        idType: type.id,
      });
      return article;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ArticleService;
