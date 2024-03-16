export interface TreeNode {
    key: string;
    label: string;
    data: string;
    icon: string;
    children?: TreeNode[];
}

export function createTreeFromPaths(paths: string[]): TreeNode[] {
    const treeNodes: TreeNode[] = [];

    for (const path of paths) {
        const parts = path.split('/');
        let currentNode: TreeNode | null = null;
        let parentNode: TreeNode | null = null;
        let currentPath = '';
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            currentPath += part + (i < parts.length - 1 ? '/' : '');
            const icon =
                i === parts.length - 1
                    ? 'pi pi-fw pi-file'
                    : 'pi pi-fw pi-folder';

            const node: TreeNode = {
                key: currentPath,
                label: part,
                data: part,
                icon,
            };

            if (i === 0) {
                treeNodes.push(node);
            } else if (parentNode) {
                if (!parentNode.children) {
                    parentNode.children = [];
                }
                parentNode.children.push(node);
            }

            parentNode = node;
        }
    }

    return treeNodes;
}