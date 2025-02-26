import path from 'path';
import fs from 'fs';

const BASE_PATH = 'e2e';
const TEST_RESULT_DIR = 'test-results';
const SCREENSHOTS_DIR = 'screenshots';
const TEST_FILE_EXTENSION = '.spec.ts';
const MAX_SCREENSHOT_INDEX = 9999;

/**
 * スクリーンショット保存パス
 */
export interface ScreenshotPath {
    /**
     * スクリーンショット保存ディレクトリのパス
     */
    dir: string;
    /**
     * スクリーンショットファイル名
     */
    file: string;
    /**
     * スクリーンショット保存パス
     */
    full: string;
}

/**
 * テスト情報
 * 主にTestInfo の型を模倣したもの（テストのために共通インターフェースを用意）
 * @see https://playwright.dev/docs/api/class-testinfo
 */
export interface TestInfoInterface {
    /**
     * テストファイルのパス
     */
    file: string;
}

/**
 * テスト開始時刻を取得する
 * @returns {string} yyyymmddhhmmss 形式の文字列
 * @example
 *   getStartTimestamp() -> '20250225123456'
 */
export const getStartTimestamp = async (): Promise<string> => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T]/g, '').split('.')[0];
    if (!timestamp) {
        throw new Error('テスト開始時刻を取得できませんでした');
    }
    return timestamp;
};


/**
 * テストごとのスクリーンショット保存パスを生成する
 * @param {TestInfoInterface} testInfo
 * @param {number} index
 * @returns {ScreenshotPath} スクリーンショットの保存パス
 * @example
 *   getScreenshotPath({ file: 'e2e/pages/index/a.spec.ts' }, 1, '20250225123456', '初期表示')
 *     -> {
 *          dir: 'test-result/screenshots/pages/index/a/20250225123456',
 *          file: '0001-初期表示.png',
 *          full: 'test-result/screenshots/pages/index/a/20250225123456/0001-初期表示.png'
 *    }
 */
export async function getScreenshotPath(
    testInfo: TestInfoInterface,
    index: number,
    startTimestamp: string,
    name: string
): Promise<ScreenshotPath> {
    // example: e2e/pages/index/a.spec.ts -> pages/index/a.spec.ts
    const relativeTestPath = await getBaseRelativeTestPath(testInfo);
    // example: pages/index/a.spec.ts -> pages/index/a
    const testFolder = await getTestFolder(relativeTestPath);
    // example: test-result/screenshots/pages/index/a/20250225123456
    const dir = await getScreenshotDirPath(testFolder, startTimestamp);
    // example: 0001-初期表示.png
    const fileName = await getScreenshotFileName(index, name);

    // フォルダが存在しない場合は作成
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return {
        dir: dir,
        file: fileName,
        full: path.join(dir, fileName),
    };
}


/**
 * テストファイルのルート（/e2e/）からの相対パスを取得する
 * @param {TestInfoInterface} testInfo テスト情報
 * @returns {string} テストファイルの相対パス
 * @throws {Error} テストファイルのパスが指定されていない場合
 * @example
 *   getBaseRelativeTestPath({ file: 'e2e/pages/index/a.spec.ts' })
 *     -> 'pages/index/a.spec.ts'
 *   getBaseRelativeTestPath({ file: 'e2e/scenario/registration/b.spec.ts' })
 *     -> 'scenario/registration/b.spec.ts'
 */
async function getBaseRelativeTestPath(testInfo: TestInfoInterface): Promise<string> {
    if (!testInfo.file) {
        throw new Error('テストファイルのパスを指定してください');
    }
    return path.relative(BASE_PATH, testInfo.file);
}

/**
 * テストフォルダ名を取得する
 * @param {string} relativeTestPath テストファイルの相対パス
 * @returns {string} テストフォルダ名
 * @throws {Error} テストファイルの相対パスが指定されていない場合
 * @example
 *   getTestFolder('pages/index/a.spec.ts') -> 'pages/index'
 *   getTestFolder('scenario/registration/b.spec.ts') -> 'scenario/registration'
 */
async function getTestFolder(relativeTestPath: string): Promise<string> {
    if (!relativeTestPath) {
        throw new Error('テストファイルの相対パスを指定してください');
    }
    return relativeTestPath.replace(TEST_FILE_EXTENSION, '');
}

/**
 * スクリーンショット保存ディレクトリのパスを生成する
 * @param {string} testFolder テストフォルダ名
 * @param {string} startTimestamp テスト開始時刻
 * @returns {string} スクリーンショット保存ディレクトリのパス
 * @throws {Error} テストフォルダ名が指定されていない場合
 * @throws {Error} テスト開始時刻が指定されていない場合
 * @example
 *   getScreenshotDirPath('pages/index/a', '20250225123456')
 *     -> 'test-result/screenshots/pages/index/a/20250225123456'
 *   getScreenshotDirPath('scenario/registration/b', '20250225123456')
 *     -> 'test-result/screenshots/scenario/registration/b/20250225123456'
 */
async function getScreenshotDirPath(testFolder: string, startTimestamp: string): Promise<string> {
    if (!testFolder) {
        throw new Error('テストフォルダ名を指定してください');
    }
    if (!startTimestamp) {
        throw new Error('テスト開始時刻を指定してください');
    }
    return path.join(
        TEST_RESULT_DIR,
        SCREENSHOTS_DIR,
        testFolder,
        startTimestamp
    );
}

/**
 * スクリーンショットファイル名を生成する
 * @param {number} index スクリーンショットの番号（1～9999
 * @param {string} name スクリーンショット名
 * @returns {string} スクリーンショットファイル名
 * @throws {Error} スクリーンショットの番号が1～9999の範囲外の場合
 * @throws {Error} スクリーンショット名が指定されていない場合
 * @example
 *   getScreenshotFileName(1, '初期表示') -> '0001-初期表示.png'
 *   getScreenshotFileName(2, '言語変更') -> '0002-言語変更.png'
 */
async function getScreenshotFileName(index: number, name: string): Promise<string> {
    if (index < 1 || index > MAX_SCREENSHOT_INDEX) {
        throw new Error('スクリーンショットの番号は1～9999の範囲で指定してください');
    }
    if (!name) {
        throw new Error('スクリーンショット名を指定してください');
    }
    return `${index.toString().padStart(4, '0')}-${name}.png`;
}


/**
 * テスト用の関数エクスポート
 */
export const _testonly = {
    getBaseRelativeTestPath,
    getTestFolder,
    getScreenshotDirPath,
    getScreenshotFileName,
};