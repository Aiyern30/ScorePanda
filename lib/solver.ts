export const findDFSExpressions = (nums: number[], target: number): string[] => {
  const results: string[] = [];

  const isClose = (a: number, b: number, tolerance = 1e-6) => {
    return Math.abs(a - b) < tolerance;
  };

  const dfs = (currentNums: number[], exprs: string[]) => {
    if (currentNums.length === 1) {
      if (isClose(currentNums[0], target)) {
        results.push(exprs[0]);
      }
      return;
    }

    const n = currentNums.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = currentNums[i];
        const b = currentNums[j];
        const exprA = exprs[i];
        const exprB = exprs[j];

        const remaining = currentNums
          .map((num, k) => (k !== i && k !== j ? num : undefined))
          .filter((num): num is number => num !== undefined);

        const remainingExprs = exprs
          .map((expr, k) => (k !== i && k !== j ? expr : undefined))
          .filter((expr): expr is string => expr !== undefined);

        const operations: [number, string][] = [
          [a + b, `(${exprA} + ${exprB})`],
          [a - b, `(${exprA} - ${exprB})`],
          [b - a, `(${exprB} - ${exprA})`],
          [a * b, `(${exprA} * ${exprB})`],
        ];

        if (b !== 0) {
          operations.push([a / b, `(${exprA} / ${exprB})`]);
        }
        if (a !== 0) {
          operations.push([b / a, `(${exprB} / ${exprA})`]);
        }

        for (const [val, exprStr] of operations) {
          dfs([...remaining, val], [...remainingExprs, exprStr]);
        }
      }
    }
  };

  dfs(nums, nums.map(String));
  return results;
};
