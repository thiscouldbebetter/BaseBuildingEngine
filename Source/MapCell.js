
function MapCell(terrainCode, hasRoad)
{
	this.terrainCode = terrainCode;
	this.hasRoad = hasRoad;
}
{
	MapCell.prototype.resourcesProducedPerTurnAddToGroup = function(resourceGroup, map)
	{
		resourceGroup.resourcesAdd(this.terrain(map).resourcesProducedPerTurn);
		var resourcesSum = resourceGroup.resources;
		if (this.hasRoad)
		{
			resourcesSum["Trade"].quantity += 1;
		}
		return resourceGroup;
	}

	MapCell.prototype.terrain = function(map)
	{
		return map.terrains[this.terrainCode];
	}
}