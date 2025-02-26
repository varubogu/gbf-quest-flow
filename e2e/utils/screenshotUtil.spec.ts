import fs from 'fs';
import { test, expect } from '@playwright/test';
import {
    getScreenshotPath,
    getStartTimestamp,
    type TestInfoInterface,
    _testonly,
} from './screenshotUtil';

const {
    getBaseRelativeTestPath,
    getTestFolder,
    getScreenshotDirPath,
    getScreenshotFileName,
} = _testonly;

test.describe('単体テスト', async () => {
    test.describe('getStartTimestamp', async () => {
        test('テスト開始時刻が正しく生成されること', async () => {
            const startTimestamp = await getStartTimestamp();
            expect(startTimestamp).toBeDefined();
        });
    });

    test.describe('getScreenshotFileName', async () => {
        test('1～9999の範囲で指定した場合、正しいファイル名が生成されること', async () => {
            const index = 1;
            const name = '初期表示';
            const fileName = await getScreenshotFileName(index, name);
            expect(fileName).toBe('0001-初期表示.png');
        });

        test('1より小さい値で指定した場合、エラーが発生すること', async () => {
            const index = 0;
            const name = '初期表示';
            expect(
                async () => await getScreenshotFileName(index, name)
            ).rejects.toThrow('スクリーンショットの番号は1～9999の範囲で指定してください');
        });

        test('1より大きい値で指定した場合、エラーが発生すること', async () => {
            const index = 10000;
            const name = '初期表示';
            expect(
                async () => await getScreenshotFileName(index, name)
            ).rejects.toThrow('スクリーンショットの番号は1～9999の範囲で指定してください');
        });

        test('名前を指定しなかった場合、エラーが発生すること', async () => {
            const index = 1;
            const name = '';
            expect(
                async () => await getScreenshotFileName(index, name)
            ).rejects.toThrow('スクリーンショット名を指定してください');
        });
    });

    test.describe('getScreenshotDirPath', async () => {
        test('テストフォルダ名が正しく生成されること', async () => {
            const relativeTestPath = 'pages/index/a.spec.ts';
            const startTimestamp = '20250225123456';
            const dir = await getScreenshotDirPath(relativeTestPath, startTimestamp);
            expect(dir).toBe(`test-results/screenshots/${relativeTestPath}/${startTimestamp}`);
        });

        test('テストフォルダ名を指定しなかった場合、エラーが発生すること', async () => {
            const relativeTestPath = '';
            const startTimestamp = '20250225123456';
            expect(
                async () => await getScreenshotDirPath(relativeTestPath, startTimestamp)
            ).rejects.toThrow('テストフォルダ名を指定してください');
        });

        test('テスト開始時刻を指定しなかった場合、エラーが発生すること', async () => {
            const relativeTestPath = 'pages/index/a.spec.ts';
            const startTimestamp = '';
            expect(
                async () => await getScreenshotDirPath(relativeTestPath, startTimestamp)
            ).rejects.toThrow('テスト開始時刻を指定してください');
        });
    });

    test.describe('getTestFolder', async () => {
        test('テストフォルダ名が正しく生成されること', async () => {
            const relativeTestPath = 'pages/index/a.spec.ts';
            const folder = await getTestFolder(relativeTestPath);
            expect(folder).toBe('pages/index/a');
        });

        test('テストファイルの相対パスを指定しなかった場合、エラーが発生すること', async () => {
            const relativeTestPath = '';
            expect(
                async () => await getTestFolder(relativeTestPath)
            ).rejects.toThrow('テストファイルの相対パスを指定してください');
        });
    });

    test.describe('getBaseRelativeTestPath', async () => {
        test('テストファイルの相対パスが正しく生成されること', async () => {
            const testInfoMock: TestInfoInterface = {
                file: 'e2e/pages/index/a.spec.ts',
            };
            const baseRelativeTestPath = await getBaseRelativeTestPath(testInfoMock);
            expect(baseRelativeTestPath).toBe('pages/index/a.spec.ts');
        });

        test('テストファイルの相対パスを指定しなかった場合、エラーが発生すること', async () => {
            const testInfoMock: TestInfoInterface = {
                file: '',
            };
            expect(
                async () => await getBaseRelativeTestPath(testInfoMock)
            ).rejects.toThrow('テストファイルのパスを指定してください');
        });
    });
});

test.describe('結合テスト', async () => {
    const testInfoMock: TestInfoInterface = {
        file: 'e2e/pages/index/a.spec.ts',
    };

    test('スクリーンショットパスが正しく生成されること', async () => {
        const index = 1;
        const name = '初期表示';
        const startTimestamp = 'screenshot-test';

        const screenshotPath = await getScreenshotPath(testInfoMock, index, startTimestamp, name);

        // example: test-results/screenshots/pages/index/a/screenshot-test
        expect(screenshotPath.dir).toContain('test-results/screenshots/pages/index');
        // example: 0001-初期表示.png
        expect(screenshotPath.file).toBe(await getScreenshotFileName(index, name));
        // example: test-results/screenshots/pages/index/a/screenshot-test/0001-初期表示.png
        expect(screenshotPath.full).toBe(`${screenshotPath.dir}/${screenshotPath.file}`);
        // ディレクトリが存在すること(test-results/screenshots/pages/index/a/screenshot-test)
        expect(fs.existsSync(screenshotPath.dir)).toBe(true);
    });

    test('無効なインデックスでエラーが発生すること', async () => {
        const index = 10000; // Invalid index
        const name = '無効な表示';
        const startTimestamp = await getStartTimestamp();

        await expect(getScreenshotPath(testInfoMock, index, startTimestamp, name)).rejects.toThrow('スクリーンショットの番号は1～9999の範囲で指定してください');
    });

    test('無効な名前でエラーが発生すること', async () => {
        const index = 1;
        const name = ''; // Invalid name
        const startTimestamp = await getStartTimestamp();

        await expect(getScreenshotPath(testInfoMock, index, startTimestamp, name)).rejects.toThrow('スクリーンショット名を指定してください');
    });
});
