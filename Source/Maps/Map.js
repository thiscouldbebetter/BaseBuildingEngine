
function Map(cellSizeInPixels, pos, terrains, cellsAsStrings)
{
	this.cellSizeInPixels = cellSizeInPixels;
	this.pos = pos;
	this.terrains = terrains;
	this.cellSizeInPixelsHalf = this.cellSizeInPixels.clone().divideScalar(2);

	this.terrains.addLookups("codeChar");

	this.sizeInCells = new Coords
	(
		cellsAsStrings[0].length / Map.CharsPerCell,
		cellsAsStrings.length
	);

	this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract
	(
		new Coords(1, 1)
	);

	this.cells = [];
	var cellPos = new Coords();

	for (var y = 0; y < this.sizeInCells.y; y++)
	{
		cellPos.y = y;
		var cellRowAsString = cellsAsStrings[cellPos.y];

		for (var x = 0; x < this.sizeInCells.x; x++)
		{
			cellPos.x = x;

			var cellCodeIndexFirstInRow = cellPos.x * Map.CharsPerCell;
			var terrainCode = cellRowAsString[cellCodeIndexFirstInRow];
			var roadCode = cellRowAsString[cellCodeIndexFirstInRow + 1];
			var hasRoad = (roadCode == "r");
			var cell = new MapCell(terrainCode, hasRoad);
			this.cells.push(cell);
		}
	}
}

{
	Map.CharsPerCell = 2;

	Map.prototype.cellAtPos = function(cellPos)
	{
		var cellIndex = this.cellIndexAtPos(cellPos);
		var cell = this.cells[cellIndex];
		return cell;
	}

	Map.prototype.cellIndexAtPos = function(cellPos)
	{
		return cellPos.y * this.sizeInCells.x + cellPos.x;
	}

	// drawable

	Map.prototype.draw = function(display)
	{
		var map = this;
		var sizeInCells = map.sizeInCells;
		var mapCellSizeInPixels = map.cellSizeInPixels;
		var cellPos = display._mapCellPos;
		var drawPos = display._drawPos;

		for (var y = 0; y < sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < sizeInCells.x; x++)
			{
				cellPos.x = x;

				var cellTerrain = map.terrainAtPos
				(
					cellPos
				);

				drawPos.overwriteWith
				(
					cellPos
				).multiply
				(
					mapCellSizeInPixels
				).add
				(
					map.pos
				);

				display.drawRectangle
				(
					drawPos,
					mapCellSizeInPixels,
					this.colorFore, // border
					cellTerrain.color // fill
				);
			}
		}
	}
}
