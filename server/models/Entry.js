const mongoose = require("mongoose");

const developmentalStages = {
	EMBROY: "embryo",
	FETUS: "fetus",
	NEONATE: "neonate",
	INFANT: "infant",
	JUVENILE: "juvenile",
	ADULT: "adult",
};

const unitsOfNumber = {
	DAYS: "days",
	WEEKS: "weeks",
	MONTHS: "months",
	YEARS: "years",
};

const origins = {
	POSTNATAL: "postNatal",
	POSTCONECPTION: "postConception",
};

const genders = {
	MALE: "m",
	FEMALE: "f",
	UNDEFINED: "u",
};

const EntrySchema = mongoose.Schema(
	{
		identification: {
			collectionCode: {
				type: String,
			},
			itemCode: {
				type: String,
				required: true,
			},
			individualCode: {
				type: String,
				required: true,
			},
			NCBITaxonomyCode: {
				type: Number,
			},
			wikipediaSpeciesName: {
				type: String,
			},
			bionomialSpeciesName: {
				type: String,
			},
		},
		archivalIdentification: {
			archivalIndividualCode: {
				type: String,
			},
			archivalSpeciesCode: {
				type: String,
			},
			archivalSpeciesOrder: {
				type: String,
			},
			archivalSpeciesName: {
				type: String,
			},
		},
		physiologicalInformation: {
			age: {
				developmentalStage: {
					type: String,
					enum: Object.values(developmentalStages),
				},
				number: {
					type: Number,
				},
				unitOfNumber: {
					type: String,
					enum: Object.values(unitsOfNumber),
				},
				origin: {
					type: String,
					enum: Object.values(origins),
					default: "postNatal",
				},
			},
			sex: {
				type: String,
				enum: Object.values(genders),
				default: "u",
			},
			bodyWeight: {
				type: Number, //standard unit : grams
				default: null,
			},
			brainWeight: {
				type: Number, //standard unit : grams
				default: null,
			},
		},

		histologicalInformation: {
			stainingMethod: {
				type: String,
			},
			sectionThickness: {
				type: String, //default unit um
			},
			planeOfSectioning: {
				type: String,
				// required:true
			},
			interSectionDistance: {
				type: String,
			},
			brainPart: {
				type: String,
			},

			//work on this field
			dataThumbnailImage: {
				type: String,
			},
			comments: {
				type: String,
			},
		},

		//media column to add image:

		//TODO : work on this later on
		media: {
			data: Buffer,
			contentType: String,
		},

		//backup entry, initially false
		//on delete backup entry true;
		backupEntry: {
			type: Boolean,
			default: false,
		},

		//which collection it belongs to
		collectionID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Collection_id_of_this",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Entries", EntrySchema);
