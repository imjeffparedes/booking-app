'use strict';

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Organization', {
		id: {
			field: 'id',
			type: DataTypes.BIGINT(20),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			field: 'username',
			type: DataTypes.TEXT,
			allowNull: true
		},
		name: {
			field: 'password',
			type: DataTypes.TEXT,
			allowNull: true
		},
		name: {
			field: 'name',
			type: DataTypes.TEXT,
			allowNull: true
		},
		description: {
			field: 'description',
			type: DataTypes.TEXT,
			allowNull: true
		},
		address: {
			field: 'address',
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: ''
		}
	}, {
		timestamps: true,
		paranoid: true,
		createdAt: 'created',
		updatedAt: 'modified',
		deletedAt: 'deleted',
		freezeTableName: true,
		tableName: 'organization',
		engine: 'InnoDB',
		charset: 'utf8'
	});

};