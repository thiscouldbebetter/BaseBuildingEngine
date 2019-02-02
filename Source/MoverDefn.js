
function MoverDefn
(
	name,
	codeChar,
	industryToBuild,
	integrityMax,
	movePointsPerTurn,
	attackRange,
	attackDamage,
	defense,
	actionNamesAvailable
)
{
	this.name = name;
	this.codeChar = codeChar;
	this.industryToBuild = industryToBuild;
	this.integrityMax = integrityMax;
	this.movePointsPerTurn = movePointsPerTurn;
	this.attackRange = attackRange;
	this.attackDamage = attackDamage;
	this.defense = defense;
	this.actionNamesAvailable = actionNamesAvailable;
}

{
	MoverDefn.prototype.actionsAvailable = function()
	{
		var returnValues = [];

		var actionsAll = Globals.Instance.world.actions;

		for (var i = 0; i < this.actionNamesAvailable.length; i++)
		{
			var actionName = this.actionNamesAvailable[i];
			var action = actionsAll[actionName];
			returnValues.push(action);
		}

		return returnValues;
	}

	MoverDefn.prototype.description = function()
	{
		var returnValue = 
			this.name
			+ ", Attack:" + this.attackDamage 
			+ ", Defense:" + this.defense 
			+ ", Move:" + this.movePointsPerTurn;
		return returnValue;
	}
}
