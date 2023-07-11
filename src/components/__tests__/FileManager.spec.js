import { describe, it, expect, vitest } from 'vitest'
import { mount } from '@vue/test-utils'
import FileManager from '../FileManager.vue'

vitest('openFolder', (test) => {
  test('should add selected files to state.selectedFiles', async () => {
    // Setup
    const files = [
      { path: '/path/to/file1.txt', name: 'file1.txt' },
      { path: '/path/to/file2.txt', name: 'file2.txt' },
    ];

    // Mock dependencies
    const dialog = { open: async () => '/path/to/folder' };
    const readDir = async () => files;
    const invoke = async () => ({ is_folder: false, modified: { secs_since_epoch: 1626864000 } });

    // Call the function
    await openFolder(dialog, readDir, invoke);

    // Assertions
    test.assertEquals(state.selectedFiles, [
      {
        id: test.expect.any(String),
        name: 'file1',
        extension: 'txt',
        path: '/path/to/',
        date: 1626864000000,
        fullname: 'file1.txt',
        newfullname: 'file1.txt',
        saved: false,
      },
      {
        id: test.expect.any(String),
        name: 'file2',
        extension: 'txt',
        path: '/path/to/',
        date: 1626864000000,
        fullname: 'file2.txt',
        newfullname: 'file2.txt',
        saved: false,
      },
    ]);
  });

  test('should clear previous files and reset loading state when stopLoading is true', async () => {
    // Setup
    const files = [
      { path: '/path/to/file1.txt', name: 'file1.txt' },
      { path: '/path/to/file2.txt', name: 'file2.txt' },
    ];

    // Mock dependencies
    const dialog = { open: async () => '/path/to/folder' };
    const readDir = async () => files;
    const invoke = async () => ({ is_folder: false, modified: { secs_since_epoch: 1626864000 } });

    // Set initial state
    state.stopLoading = true;
    state.selectedFiles = [{ id: 'file123', name: 'file123.txt' }];
    text.backupText = 'previous text';

    // Call the function
    await openFolder(dialog, readDir, invoke);

    // Assertions
    test.assertEquals(state.selectedFiles, []);
    test.assert(state.isLoading === false);
    test.assert(state.stopLoading === false);
    test.assert(process.value === 0);
    test.assert(text.backupText === 'previous text');
  });

  // Add more test cases here...
});