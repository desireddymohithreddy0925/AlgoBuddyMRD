'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// 2D Segment Tree (Range Sum Query)
class SegmentTree2D {
    constructor(matrix) {
        this.m = matrix.length;
        this.n = this.m > 0 ? matrix[0].length : 0;
        this.tree = Array.from({ length: 4 * this.m }, () => new Array(4 * this.n).fill(0));
        
        if (this.m > 0 && this.n > 0) {
            this.buildRow(matrix, 0, 0, this.m - 1);
        }
    }

    buildCol(matrix, rNode, rStart, rEnd, cNode, cStart, cEnd) {
        if (cStart === cEnd) {
            if (rStart === rEnd) {
                this.tree[rNode][cNode] = matrix[rStart][cStart];
            } else {
                this.tree[rNode][cNode] = this.tree[2 * rNode + 1][cNode] + this.tree[2 * rNode + 2][cNode];
            }
            return;
        }
        let mid = Math.floor((cStart + cEnd) / 2);
        this.buildCol(matrix, rNode, rStart, rEnd, 2 * cNode + 1, cStart, mid);
        this.buildCol(matrix, rNode, rStart, rEnd, 2 * cNode + 2, mid + 1, cEnd);
        this.tree[rNode][cNode] = this.tree[rNode][2 * cNode + 1] + this.tree[rNode][2 * cNode + 2];
    }

    buildRow(matrix, rNode, rStart, rEnd) {
        if (rStart !== rEnd) {
            let mid = Math.floor((rStart + rEnd) / 2);
            this.buildRow(matrix, 2 * rNode + 1, rStart, mid);
            this.buildRow(matrix, 2 * rNode + 2, mid + 1, rEnd);
        }
        this.buildCol(matrix, rNode, rStart, rEnd, 0, 0, this.n - 1);
    }

    updateCol(rNode, rStart, rEnd, cNode, cStart, cEnd, rIdx, cIdx, val) {
        if (cStart === cEnd) {
            if (rStart === rEnd) {
                this.tree[rNode][cNode] = val;
            } else {
                this.tree[rNode][cNode] = this.tree[2 * rNode + 1][cNode] + this.tree[2 * rNode + 2][cNode];
            }
            return;
        }
        let mid = Math.floor((cStart + cEnd) / 2);
        if (cIdx <= mid) {
            this.updateCol(rNode, rStart, rEnd, 2 * cNode + 1, cStart, mid, rIdx, cIdx, val);
        } else {
            this.updateCol(rNode, rStart, rEnd, 2 * cNode + 2, mid + 1, cEnd, rIdx, cIdx, val);
        }
        this.tree[rNode][cNode] = this.tree[rNode][2 * cNode + 1] + this.tree[rNode][2 * cNode + 2];
    }

    updateRow(rNode, rStart, rEnd, rIdx, cIdx, val) {
        if (rStart !== rEnd) {
            let mid = Math.floor((rStart + rEnd) / 2);
            if (rIdx <= mid) {
                this.updateRow(2 * rNode + 1, rStart, mid, rIdx, cIdx, val);
            } else {
                this.updateRow(2 * rNode + 2, mid + 1, rEnd, rIdx, cIdx, val);
            }
        }
        this.updateCol(rNode, rStart, rEnd, 0, 0, this.n - 1, rIdx, cIdx, val);
    }

    queryCol(rNode, cNode, cStart, cEnd, qColStart, qColEnd) {
        if (qColEnd < cStart || cEnd < qColStart) return 0;
        if (qColStart <= cStart && cEnd <= qColEnd) return this.tree[rNode][cNode];
        let mid = Math.floor((cStart + cEnd) / 2);
        return this.queryCol(rNode, 2 * cNode + 1, cStart, mid, qColStart, qColEnd) +
               this.queryCol(rNode, 2 * cNode + 2, mid + 1, cEnd, qColStart, qColEnd);
    }

    queryRow(rNode, rStart, rEnd, qRowStart, qRowEnd, qColStart, qColEnd) {
        if (qRowEnd < rStart || rEnd < qRowStart) return 0;
        if (qRowStart <= rStart && rEnd <= qRowEnd) {
            return this.queryCol(rNode, 0, 0, this.n - 1, qColStart, qColEnd);
        }
        let mid = Math.floor((rStart + rEnd) / 2);
        return this.queryRow(2 * rNode + 1, rStart, mid, qRowStart, qRowEnd, qColStart, qColEnd) +
               this.queryRow(2 * rNode + 2, mid + 1, rEnd, qRowStart, qRowEnd, qColStart, qColEnd);
    }
}`,

  python: `# 2D Segment Tree (Range Sum Query)
class SegmentTree2D:
    def __init__(self, matrix):
        self.m = len(matrix)
        self.n = len(matrix[0]) if self.m > 0 else 0
        self.tree = [[0] * (4 * self.n) for _ in range(4 * self.m)]
        if self.m > 0 and self.n > 0:
            self.build_row(matrix, 0, 0, self.m - 1)

    def build_col(self, matrix, r_node, r_start, r_end, c_node, c_start, c_end):
        if c_start == c_end:
            if r_start == r_end:
                self.tree[r_node][c_node] = matrix[r_start][c_start]
            else:
                self.tree[r_node][c_node] = self.tree[2 * r_node + 1][c_node] + self.tree[2 * r_node + 2][c_node]
            return
        
        mid = (c_start + c_end) // 2
        self.build_col(matrix, r_node, r_start, r_end, 2 * c_node + 1, c_start, mid)
        self.build_col(matrix, r_node, r_start, r_end, 2 * c_node + 2, mid + 1, c_end)
        self.tree[r_node][c_node] = self.tree[r_node][2 * c_node + 1] + self.tree[r_node][2 * c_node + 2]

    def build_row(self, matrix, r_node, r_start, r_end):
        if r_start != r_end:
            mid = (r_start + r_end) // 2
            self.build_row(matrix, 2 * r_node + 1, r_start, mid)
            self.build_row(matrix, 2 * r_node + 2, mid + 1, r_end)
        self.build_col(matrix, r_node, r_start, r_end, 0, 0, self.n - 1)

    def update_col(self, r_node, r_start, r_end, c_node, c_start, c_end, r_idx, c_idx, val):
        if c_start == c_end:
            if r_start == r_end:
                self.tree[r_node][c_node] = val
            else:
                self.tree[r_node][c_node] = self.tree[2 * r_node + 1][c_node] + self.tree[2 * r_node + 2][c_node]
            return
        
        mid = (c_start + c_end) // 2
        if c_idx <= mid:
            self.update_col(r_node, r_start, r_end, 2 * c_node + 1, c_start, mid, r_idx, c_idx, val)
        else:
            self.update_col(r_node, r_start, r_end, 2 * c_node + 2, mid + 1, c_end, r_idx, c_idx, val)
        self.tree[r_node][c_node] = self.tree[r_node][2 * c_node + 1] + self.tree[r_node][2 * c_node + 2]

    def update_row(self, r_node, r_start, r_end, r_idx, c_idx, val):
        if r_start != r_end:
            mid = (r_start + r_end) // 2
            if r_idx <= mid:
                self.update_row(2 * r_node + 1, r_start, mid, r_idx, c_idx, val)
            else:
                self.update_row(2 * r_node + 2, mid + 1, r_end, r_idx, c_idx, val)
        self.update_col(r_node, r_start, r_end, 0, 0, self.n - 1, r_idx, c_idx, val)

    def query_col(self, r_node, c_node, c_start, c_end, q_c_start, q_c_end):
        if q_c_end < c_start or c_end < q_c_start:
            return 0
        if q_c_start <= c_start and c_end <= q_c_end:
            return self.tree[r_node][c_node]
        
        mid = (c_start + c_end) // 2
        return self.query_col(r_node, 2 * c_node + 1, c_start, mid, q_c_start, q_c_end) + \
               self.query_col(r_node, 2 * c_node + 2, mid + 1, c_end, q_c_start, q_c_end)

    def query_row(self, r_node, r_start, r_end, q_r_start, q_r_end, q_c_start, q_c_end):
        if q_r_end < r_start or r_end < q_r_start:
            return 0
        if q_r_start <= r_start and r_end <= q_r_end:
            return self.query_col(r_node, 0, 0, self.n - 1, q_c_start, q_c_end)
        
        mid = (r_start + r_end) // 2
        return self.query_row(2 * r_node + 1, r_start, mid, q_r_start, q_r_end, q_c_start, q_c_end) + \
               self.query_row(2 * r_node + 2, mid + 1, r_end, q_r_start, q_r_end, q_c_start, q_c_end)
`,

  cpp: `// 2D Segment Tree (Range Sum Query)
#include <vector>
using namespace std;

class SegmentTree2D {
private:
    int m, n;
    vector<vector<int>> tree;

    void buildCol(const vector<vector<int>>& matrix, int rNode, int rStart, int rEnd, int cNode, int cStart, int cEnd) {
        if (cStart == cEnd) {
            if (rStart == rEnd) {
                tree[rNode][cNode] = matrix[rStart][cStart];
            } else {
                tree[rNode][cNode] = tree[2 * rNode + 1][cNode] + tree[2 * rNode + 2][cNode];
            }
            return;
        }
        int mid = (cStart + cEnd) / 2;
        buildCol(matrix, rNode, rStart, rEnd, 2 * cNode + 1, cStart, mid);
        buildCol(matrix, rNode, rStart, rEnd, 2 * cNode + 2, mid + 1, cEnd);
        tree[rNode][cNode] = tree[rNode][2 * cNode + 1] + tree[rNode][2 * cNode + 2];
    }

    void buildRow(const vector<vector<int>>& matrix, int rNode, int rStart, int rEnd) {
        if (rStart != rEnd) {
            int mid = (rStart + rEnd) / 2;
            buildRow(matrix, 2 * rNode + 1, rStart, mid);
            buildRow(matrix, 2 * rNode + 2, mid + 1, rEnd);
        }
        buildCol(matrix, rNode, rStart, rEnd, 0, 0, n - 1);
    }

    void updateCol(int rNode, int rStart, int rEnd, int cNode, int cStart, int cEnd, int rIdx, int cIdx, int val) {
        if (cStart == cEnd) {
            if (rStart == rEnd) {
                tree[rNode][cNode] = val;
            } else {
                tree[rNode][cNode] = tree[2 * rNode + 1][cNode] + tree[2 * rNode + 2][cNode];
            }
            return;
        }
        int mid = (cStart + cEnd) / 2;
        if (cIdx <= mid) {
            updateCol(rNode, rStart, rEnd, 2 * cNode + 1, cStart, mid, rIdx, cIdx, val);
        } else {
            updateCol(rNode, rStart, rEnd, 2 * cNode + 2, mid + 1, cEnd, rIdx, cIdx, val);
        }
        tree[rNode][cNode] = tree[rNode][2 * cNode + 1] + tree[rNode][2 * cNode + 2];
    }

    void updateRow(int rNode, int rStart, int rEnd, int rIdx, int cIdx, int val) {
        if (rStart != rEnd) {
            int mid = (rStart + rEnd) / 2;
            if (rIdx <= mid) {
                updateRow(2 * rNode + 1, rStart, mid, rIdx, cIdx, val);
            } else {
                updateRow(2 * rNode + 2, mid + 1, rEnd, rIdx, cIdx, val);
            }
        }
        updateCol(rNode, rStart, rEnd, 0, 0, n - 1, rIdx, cIdx, val);
    }

    int queryCol(int rNode, int cNode, int cStart, int cEnd, int qColStart, int qColEnd) {
        if (qColEnd < cStart || cEnd < qColStart) return 0;
        if (qColStart <= cStart && cEnd <= qColEnd) return tree[rNode][cNode];
        int mid = (cStart + cEnd) / 2;
        return queryCol(rNode, 2 * cNode + 1, cStart, mid, qColStart, qColEnd) +
               queryCol(rNode, 2 * cNode + 2, mid + 1, cEnd, qColStart, qColEnd);
    }

    int queryRow(int rNode, int rStart, int rEnd, int qRowStart, int qRowEnd, int qColStart, int qColEnd) {
        if (qRowEnd < rStart || rEnd < qRowStart) return 0;
        if (qRowStart <= rStart && rEnd <= qRowEnd) {
            return queryCol(rNode, 0, 0, n - 1, qColStart, qColEnd);
        }
        int mid = (rStart + rEnd) / 2;
        return queryRow(2 * rNode + 1, rStart, mid, qRowStart, qRowEnd, qColStart, qColEnd) +
               queryRow(2 * rNode + 2, mid + 1, rEnd, qRowStart, qRowEnd, qColStart, qColEnd);
    }

public:
    SegmentTree2D(const vector<vector<int>>& matrix) {
        m = matrix.size();
        n = m > 0 ? matrix[0].size() : 0;
        tree.assign(4 * m, vector<int>(4 * n, 0));
        if (m > 0 && n > 0) {
            buildRow(matrix, 0, 0, m - 1);
        }
    }

    void update(int rIdx, int cIdx, int val) {
        if (m > 0 && n > 0) {
            updateRow(0, 0, m - 1, rIdx, cIdx, val);
        }
    }

    int query(int qRowStart, int qRowEnd, int qColStart, int qColEnd) {
        if (m == 0 || n == 0) return 0;
        return queryRow(0, 0, m - 1, qRowStart, qRowEnd, qColStart, qColEnd);
    }
};`
};

const fileNames = {
    javascript: 'segmentTree2D.js',
    python: 'segment_tree_2d.py',
    cpp: 'segment_tree_2d.cpp'
};

const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;
