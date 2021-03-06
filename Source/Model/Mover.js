
function Mover(defnName, factionName, orientation, pos)
{
	this.defnName = defnName;
	this.factionName = factionName;
	this.orientation = orientation;
	this.pos = pos;
}

{
	Mover.prototype.defn = function()
	{
		return Globals.Instance.world.moverDefns[this.defnName];
	}

	Mover.prototype.faction = function()
	{
		return Globals.Instance.world.factions[this.factionName];
	}

	Mover.prototype.name = function()
	{
		return this.factionName + " " + this.defnName;
	}

	Mover.prototype.initialize = function()
	{
		var defn = this.defn();
		this.integrity = defn.integrityMax;
		this.movePoints = defn.movePointsPerTurn;
	}

	// drawable

	Mover.prototype.draw = function(display, map, isMoverActive)
	{
		var mover = this;
		var moverDefn = mover.defn();

		var mapCellSizeInPixels = map.cellSizeInPixels;
		var mapCellSizeInPixelsHalf = map.cellSizeInPixelsHalf;

		var drawPos = display._drawPos;
		var drawPos2 = display._drawPos2;

		drawPos.overwriteWith
		(
			mover.pos
		).multiply
		(
			mapCellSizeInPixels
		).add
		(
			map.pos
		).add
		(
			mapCellSizeInPixelsHalf
		);

		var radius = mapCellSizeInPixelsHalf.x;

		var colorStroke = (isMoverActive == true ? display.colorHighlight : display.colorFore);

		display.drawCircle
		(
			drawPos,
			radius,
			colorStroke,
			mover.faction().color
		);

		drawPos2.overwriteWith
		(
			mover.orientation
		).multiplyScalar
		(
			radius
		).add
		(
			drawPos
		);

		display.drawLine(drawPos, drawPos2, colorStroke);

		drawPos.subtract(mapCellSizeInPixelsHalf);

		display.drawTextAtPos(" " + moverDefn.codeChar, drawPos, colorStroke);

		if (isMoverActive == true)
		{
			if (this.targetPos != null)
			{
				drawPos.overwriteWith
				(
					this.targetPos
				).multiply
				(
					mapCellSizeInPixels
				).add
				(
					map.pos
				).add
				(
					mapCellSizeInPixelsHalf
				);
				display.drawCircle(drawPos, radius / 2, colorStroke, "Red");
			}
		}
	}
}
