
function Coords(x, y)
{
	this.x = x;
	this.y = y;
}

{
	// instance methods

	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y);
	}

	Coords.prototype.divide = function(other)
	{
		this.x /= other.x;
		this.y /= other.y;
		return this;
	}

	Coords.prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}

	Coords.prototype.equals = function(other)
	{
		var returnValue =
		(
			this.x == other.x
			&& this.y == other.y
		);

		return returnValue;
	}

	Coords.prototype.fromString = function(stringToParse)
	{
		var xAndYAsStrings = stringToParse.split("x");
		var xAsString = xAndYAsStrings[0];
		var yAsString = xAndYAsStrings[1];
		var x = parseFloat(xAsString);
		var y = parseFloat(yAsString);
		return this.overwriteWithXY(x, y);
	}

	Coords.prototype.isInRangeMax = function(rangeMax)
	{
		var returnValue =
		(
			this.x >= 0
			&& this.x <= rangeMax.x
			&& this.y >= 0
			&& this.y <= rangeMax.y
		);

		return returnValue;
	}

	Coords.prototype.magnitude = function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	Coords.prototype.multiply = function(other)
	{
		this.x *= other.x;
		this.y *= other.y;
		return this;
	}

	Coords.prototype.multiplyScalar = function(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;
		return this;
	}

	Coords.prototype.overwriteWithXY = function(x, y)
	{
		this.x = x;
		this.y = y;
		return this;
	}

	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	Coords.prototype.toString = function()
	{
		return this.x + "x" + this.y;
	}

	Coords.prototype.trimToRangeMax = function(rangeMax)
	{
		if (this.x < 0)
		{
			this.x = 0;
		}
		else if (this.x > rangeMax.x)
		{
			this.x = rangeMax.x;
		}

		if (this.y < 0)
		{
			this.y = 0;
		}
		else if (this.y > rangeMax.y)
		{
			this.y = rangeMax.y;
		}

		return this;
	}
}
