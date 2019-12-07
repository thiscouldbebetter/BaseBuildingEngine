
function MapCell(terrainCode, hasRoad)
{
	this.terrainCode = terrainCode;
	this.hasRoad = hasRoad;
}
{
	MapCell.prototype.resourcesProducedPerTurnAddToGroup = function(resourceGroup, map)
	{
		var terrain = this.terrain(map);
		resourceGroup.resourcesAdd(terrain.resourcesProducedPerTurn);
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
