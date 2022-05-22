"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable("Producto", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        nombre: {
          type: Sequelize.STRING
        },
        codigo: {
          type: Sequelize.STRING
        },
        descripcion: {
          type: Sequelize.STRING
        },
        precioUnidad: {
          type: Sequelize.FLOAT
        },
        activo: {
          type: Sequelize.BOOLEAN,
          unique: true,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      })
      // queryInterface.createTable("User", {
      //   id: {
      //     type: Sequelize.UUID,
      //     defaultValue: Sequelize.UUIDV4,
      //     primaryKey: true,
      //     allowNull: false
      //   },
      //   name: {
      //     type: Sequelize.STRING
      //   },
      //   firstName: {
      //     type: Sequelize.STRING
      //   },
      //   lastName: {
      //     type: Sequelize.STRING
      //   },
      //   email: {
      //     type: Sequelize.STRING,
      //     unique: true,
      //     allowNull: false
      //   },
      //   createdAt: {
      //     type: Sequelize.DATE,
      //     allowNull: false
      //   },
      //   updatedAt: {
      //     type: Sequelize.DATE,
      //     allowNull: false
      //   }
      // }),
      // queryInterface.createTable("Channel", {
      //   id: {
      //     type: Sequelize.UUID,
      //     defaultValue: Sequelize.UUIDV4,
      //     primaryKey: true,
      //     allowNull: false
      //   },
      //   userId: {
      //     type: Sequelize.UUID,
      //     references: {
      //       model: "User",
      //       key: "id",
      //     },
      //     onDelete: "SET NULL",
      //     onUpdate: "CASCADE",
      //     allowNull: false
      //   },
      //   name: {
      //     type: Sequelize.STRING,
      //     allowNull: false
      //   },
      //   createdAt: {
      //     type: Sequelize.DATE,
      //     allowNull: false
      //   },
      //   updatedAt: {
      //     type: Sequelize.DATE,
      //     allowNull: false
      //   }
      // }),
      // queryInterface.createTable("Video", {
      //   id: {
      //     type: Sequelize.UUID,
      //     defaultValue: Sequelize.UUIDV4,
      //     primaryKey: true,
      //     allowNull: false
      //   },
      //   channelId: {
      //     type: Sequelize.UUID,
      //     references: {
      //       model: "Channel",
      //       key: "id",
      //     },
      //     onDelete: "SET NULL",
      //     onUpdate: "CASCADE",
      //     allowNull: false
      //   },
      //   name: {
      //     type: Sequelize.STRING,
      //     allowNull: false
      //   },
      //   createdAt: {
      //     type: Sequelize.DATE,
      //     allowNull: false
      //   },
      //   updatedAt: {
      //     type: Sequelize.DATE,
      //     allowNull: false
      //   }
      // }), 
    ])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables()
  }
}
