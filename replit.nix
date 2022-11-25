{ pkgs }: {
  deps = [
    pkgs.nodejs
    pkgs.nodejs
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}