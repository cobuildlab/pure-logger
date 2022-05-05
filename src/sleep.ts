function msleep(n: number) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

export function sleep(n: number) {
    msleep(n * 1000);
}
