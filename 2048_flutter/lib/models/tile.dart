class Tile {
  final int value;
  final int row;
  final int col;
  final bool isNew;
  final bool isMerged;

  Tile({
    required this.value,
    required this.row,
    required this.col,
    this.isNew = false,
    this.isMerged = false,
  });

  Tile copyWith({
    int? value,
    int? row,
    int? col,
    bool? isNew,
    bool? isMerged,
  }) {
    return Tile(
      value: value ?? this.value,
      row: row ?? this.row,
      col: col ?? this.col,
      isNew: isNew ?? this.isNew,
      isMerged: isMerged ?? this.isMerged,
    );
  }
}
