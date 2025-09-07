import mongoose from "mongoose";
export declare const Data: mongoose.Model<{
    message?: string;
    id?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    message?: string;
    id?: string;
}, {}, mongoose.DefaultSchemaOptions> & {
    message?: string;
    id?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    message?: string;
    id?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    message?: string;
    id?: string;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    message?: string;
    id?: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
