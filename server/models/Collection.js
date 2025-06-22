const mongoose = require("mongoose");

const visibilities = {
	PUBLIC: "public",
	PRIVATE: "private",
};

const publicationStatus = {
	IN_REVIEW: "in_review",
	CHANGES_REQUESTED: "changes_requested",
	PUBLISHED: "published",
};

const CollectionSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},

		description: {
			type: String,
		},

		//ID of the owner of colelection
		ownerID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		visibility: {
			type: String,
			enum: Object.values(visibilities).concat([null]),
			default: "private",
		},

		provenanceDB_ID: {
			type: String,
		},

		//for deleting purposes
		backupCollection: {
			type: Boolean,
			default: false,
		},

		collaborators: [
			{
				user_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				mode: {
					type: String,
					enum: ["view", "edit"],
					default: "view",
				},
			},
		],

		contact: {
			name: {
				type: String,
			},
			email: {
				type: String,
			},
			phone: {
				type: String,
			},
			doi: {
				type: String,
			},
		},

		// New fields for publishing workflow
		publicationRequestStatus: {
			type: String,
			enum: Object.values(publicationStatus).concat([null]),
			default: null,
		},

		publicationRequestedAt: {
			type: Date,
		},

		adminComments: [
			{
				adminId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				comment: {
					type: String,
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],

		validationReport: {
			type: mongoose.Schema.Types.Mixed,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Collections", CollectionSchema);
