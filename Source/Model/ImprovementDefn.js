function ImprovementDefn(name, symbol, industryToBuild, priority, description, applyToResourceGroup)
{
	this.name = name;
	this.symbol = symbol;
	this.industryToBuild = industryToBuild;
	this.priority = priority;
	this.description = description;
	this.applyToResourceGroup = applyToResourceGroup;

	this.wealthPerTurnToMaintain = 1; // todo
}