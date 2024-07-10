const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('../models/user');

// Define the Class model
const Class = sequelize.sequelize.define('Class', {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    accuracy_metrics: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    training_data: {
        type: DataTypes.STRING,
        allowNull: true
    },
    model_details: {
        type: DataTypes.STRING,
        allowNull: true
    },
    creation_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    last_updated: {
        type: DataTypes.DATE,
        allowNull: true
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { tableName: "Class", timestamps: false });

// Define the Material model
const Material = sequelize.sequelize.define('Material', {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cost_per_unit: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    eco_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    eco_score: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { tableName: "Material", timestamps: false });

// Define the Component model
const Component = sequelize.sequelize.define('Component', {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    supplier: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cost: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    isrecyclable: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    storage_location: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { tableName: "Component", timestamps: false });

// Define the Characteristic model
const Characteristic = sequelize.sequelize.define('Characteristic', {
    // Define other attributes such as materialId, componentId, percentage
    percentage: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    env_impact: {
        type: DataTypes.STRING,
        allowNull: true
    },
    disposal_method: {
        type: DataTypes.STRING,
        allowNull: true
    },
    regulatory_compliance: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    volume: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true
    },
    facility: {
        type: DataTypes.STRING,
        allowNull: true
    },
    footprint: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { tableName: "Characteristic", timestamps: false });

// Define the ClassCharacteristic model
const ClassCharacteristic = sequelize.sequelize.define('ClassCharacteristic', {
    spec: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Additional_Info: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { tableName: "class_characteristic", timestamps: false });

// Define the Classification model
const Classification = sequelize.sequelize.define('Classification', {
    image_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    class_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    class_name: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { tableName: "classification", timestamps: false });

// Define the Image model
const Image = sequelize.sequelize.define('Image', {
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    upload_timestamp: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, { tableName: "image", timestamps: false });


// Define associations between models

Class.hasMany(ClassCharacteristic, { foreignKey: 'CLASS_ID' });
ClassCharacteristic.belongsTo(Class, { foreignKey: 'CLASS_ID' });

ClassCharacteristic.belongsTo(Characteristic, { foreignKey: 'CHARACTERISTIC_ID' });
Characteristic.hasMany(ClassCharacteristic, { foreignKey: 'CHARACTERISTIC_ID' });

Characteristic.belongsTo(Material, { foreignKey: 'MATERIAL_ID' });
Material.hasMany(Characteristic, { foreignKey: 'MATERIAL_ID' });

Characteristic.belongsTo(Component, { foreignKey: 'COMPONENT_ID' });
Component.hasMany(Characteristic, { foreignKey: 'COMPONENT_ID' });

Classification.belongsTo(User, { foreignKey: 'user_id' }); // Classification belongs to User
Classification.belongsTo(Class, { foreignKey: 'class_id' }); // Classification belongs to Class
Classification.hasMany(ClassCharacteristic, { foreignKey: 'class_id' }); // Classification has many ClassCharacteristic
// Classification has many ClassCharacteristic through Class
Class.hasMany(Classification, { foreignKey: 'class_id' });


module.exports = {
    Class,
    Material,
    Component,
    Characteristic,
    ClassCharacteristic,
    Classification,
    Image
};