
function MapTerrain(name, codeChar, movePointsToTraverse, color, resourcesProducedPerTurn)
{
	this.name = name;
	this.codeChar = codeChar;
	this.movePointsToTraverse = movePointsToTraverse;
	this.color = color;
	this.resourcesProducedPerTurn =
		resourcesProducedPerTurn.addLookups("defnName");
}
