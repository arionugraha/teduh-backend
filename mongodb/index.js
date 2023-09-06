require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const psikologSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Psikolog = mongoose.model("Psikolog", psikologSchema, "psikolog");

const reviewSchema = new mongoose.Schema({
    psikolog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Psikolog",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    message: {
        type: String,   
        required: true
    }
})

const Review = mongoose.model("Review", reviewSchema, "review");

async function createPsikolog(arrayOfPsikolog) {
    try {
        const psikolog = await Psikolog.create(arrayOfPsikolog);
        return psikolog;
    } catch (error) {
        console.log("There's something wrong...", error);
        throw error;
    }
};

async function createReview(reviews) {
    try {
        const review = await Review.create(reviews);    
        return review;
    } catch (error) {
        console.log("There's something wrong...", error);
        throw error;
    }
}

// Find psikolog by given name as the parameter
async function findPsikologByName(name) {
    const nameFormat = new RegExp(name, "i");
    try {
        const pipeline = [
            {
                $match: { name: { $regex: nameFormat } }
            }, 
            {
                $lookup: {
                    from: "review",
                    localField: "_id",
                    foreignField: "psikolog_id",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    average_rating: { $avg: "$reviews.rating" }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    reviews: {
                        _id: 1,
                        psikolog_id: 1,
                        rating: 1,
                        message: 1
                    },
                    average_rating: 1
                }
            }
        ];

        const result = await Psikolog.aggregate(pipeline);
        return result;
    } catch (error) {
        console.log("There's something wrong...", error);
        throw error;
    }
}

// Find all psikolog
async function findAll() {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: "review",
                    localField: "_id",
                    foreignField: "psikolog_id",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    average_rating: { $avg: "$reviews.rating" }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    reviews: {
                        _id: 1,
                        psikolog_id: 1,
                        rating: 1,
                        message: 1
                    },
                    average_rating: 1
                }
            }
        ];

        const result = await Psikolog.aggregate(pipeline);
        return result;
    } catch (error) {
        console.log("There's something wrong...", error);
        throw error;
    }
}

async function main() {
    try {
        // const res = await findPsikologByName("rafly");
        const res = await findAll();
        console.log(JSON.stringify(res, null, 3));
    } catch (error) {
        console.log("There's something wrong...", error);
    } finally {
        mongoose.connection.close();
    }
}

main();


// createPsikolog([
//     {name: "Rafly Ario Bayu"}, 
//     {name: "Nur Dhifa Azzahra"}, 
//     {name: "Irsad Hakim Gunawan"}
// ]);

// createReview([
//     {
//         psikolog_id: "64f8675fc4681da108a34ac6",
//         rating: 4,
//         message: "Penjelasannya enak banget"
//     },
//     {
//         psikolog_id: "64f8675fc4681da108a34ac8",
//         rating: 5,
//         message: "Ngena banget dan bikin pengen konsul lagi deh"
//     },
//     {
//         psikolog_id: "64f8675fc4681da108a34ac7",
//         rating: 4,
//         message: "Ngejelasinnya kecepetan tapi masuk kok informasinya"
//     },
//     {
//         psikolog_id: "64f8675fc4681da108a34ac6",
//         rating: 5,
//         message: "Informatif dan edukatif"
//     },
//     {
//         psikolog_id: "64f8675fc4681da108a34ac7",
//         rating: 4,
//         message: "Baik banget kaka psikolognyaaa"
//     },
//     {
//         psikolog_id: "64f8675fc4681da108a34ac8",
//         rating: 3,
//         message: "Ada pertanyaan aku yang blm kejawab, but so far aku like kok"
//     },
// ])

