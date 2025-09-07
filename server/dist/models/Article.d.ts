import mongoose from "mongoose";
export declare const Article: mongoose.Model<{
    id?: string;
    body?: string;
    title?: string;
    category?: string;
    headlineImage?: string;
    user_id?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    id?: string;
    body?: string;
    title?: string;
    category?: string;
    headlineImage?: string;
    user_id?: string;
}, {}, mongoose.DefaultSchemaOptions> & {
    id?: string;
    body?: string;
    title?: string;
    category?: string;
    headlineImage?: string;
    user_id?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    id?: string;
    body?: string;
    title?: string;
    category?: string;
    headlineImage?: string;
    user_id?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    id?: string;
    body?: string;
    title?: string;
    category?: string;
    headlineImage?: string;
    user_id?: string;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    id?: string;
    body?: string;
    title?: string;
    category?: string;
    headlineImage?: string;
    user_id?: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
