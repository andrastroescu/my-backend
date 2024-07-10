const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    registration_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profile_picture: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    TotalRecognitionFrequency: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    EnvironmentalImpact: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    EcologicalFootprintScore: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalPlasticWeight: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalPlasticCost: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalPlasticFootprint: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalPlasticVolume: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalAluminiumWeight: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalAluminiumCost: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalAluminiumFootprint: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalAluminiumVolume: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TotalDistinctMaterials: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    BIRTHDATE: {
        type: DataTypes.DATE,
        allowNull: true
    },
    CITY: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    COUNTRY: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    PHONE: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ADDRESS: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    GOAL: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    GOAL_DESCRIPTION: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    BADGE_LEVEL: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { tableName: "user",
     timestamps: false });

const UserFriends = sequelize.sequelize.define('UserFriends', {
        USER_ID: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        FRIEND_ID: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        }
});

User.belongsToMany(User, { as: 'Friends', through: UserFriends, foreignKey: 'USER_ID', otherKey: 'FRIEND_ID' });
User.belongsToMany(User, { as: 'FriendOf', through: UserFriends, foreignKey: 'FRIEND_ID', otherKey: 'USER_ID' });

User.prototype.addFriend = async function(friend) {
    await UserFriends.create({
        USER_ID: this.id,
        FRIEND_ID: friend.id
    });
};
    
module.exports = {User, UserFriends};