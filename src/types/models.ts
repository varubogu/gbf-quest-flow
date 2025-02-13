import { z } from "astro:content";

// キャラクター/武器/召喚石の共通項目のスキーマ
const itemBaseSchema = z.object({
    name: z.string(),
    note: z.string(),
});

// ジョブのスキーマ
const jobAbilitySchema = z.object({
    name: z.string(),
    note: z.string(),
});

const jobEquipmentSchema = z.object({
    name: z.string(),
    note: z.string(),
});

const jobSchema = z.object({
    name: z.string(),
    note: z.string(),
    equipment: jobEquipmentSchema,
    abilities: z.array(jobAbilitySchema),
});

// 編成メンバーのスキーマ
const memberSchema = itemBaseSchema.extend({
    awaketype: z.string(),
    accessories: z.string(),
    limitBonus: z.string(),
});

const weaponSchema = itemBaseSchema.extend({
    additionalSkill: z.string(),
});

const summonSchema = itemBaseSchema.extend({
});

// 編成情報のスキーマ
const organizationSchema = z.object({
    job: jobSchema,
    member: z.object({
        front: z.array(memberSchema),
        back: z.array(memberSchema),
    }),
    weapon: z.object({
        main: weaponSchema,
        other: z.array(weaponSchema),
        additional: z.array(weaponSchema),
    }),
    summon: z.object({
        main: summonSchema,
        friend: summonSchema,
        other: z.array(summonSchema),
        sub: z.array(summonSchema),
    }),
});

// 攻略フローの各アクションのスキーマ
const actionSchema = z.object({
    hp: z.string(),
    prediction: z.string(),
    charge: z.string(),
    guard: z.string(),
    action: z.string(),
    note: z.string(),
});

// メインのデータスキーマ
const flowSchema = z.object({
    title: z.string(),
    quest: z.string(),
    author: z.string(),
    description: z.string(),
    updateDate: z.string(),
    movie: z.string().optional(),
    note: z.string(),
    organization: organizationSchema,
    always: z.string(),
    flow: z.array(actionSchema),
});

// 型定義のエクスポート
export type ItemBase = z.infer<typeof itemBaseSchema>;
export type Member = z.infer<typeof memberSchema>;
export type Weapon = z.infer<typeof weaponSchema>;
export type Summon = z.infer<typeof summonSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type Action = z.infer<typeof actionSchema>;
export type Flow = z.infer<typeof flowSchema>;
export type JobAbility = z.infer<typeof jobAbilitySchema>;
export type JobEquipment = z.infer<typeof jobEquipmentSchema>;
export type Job = z.infer<typeof jobSchema>;

// スキーマのエクスポート
export {
    itemBaseSchema,
    memberSchema,
    weaponSchema,
    summonSchema,
    organizationSchema,
    actionSchema,
    flowSchema,
    jobAbilitySchema,
    jobEquipmentSchema,
    jobSchema,
};
