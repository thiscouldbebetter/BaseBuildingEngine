
function IncomeAllocation(researchPercentage)
{
	this.researchPercentage = researchPercentage;
	this.taxPercentage = 100 - this.researchPercentage;

	this.name = this.toString();
}
{
	IncomeAllocation.prototype.resourceGroupAllocate = function(resourceGroup)
	{
		var resources = resourceGroup.resources;
		var tradeToAllocate = resources["Trade"].quantity;
		var researchRate = this.researchRate();
		var researchAllocated = Math.round(tradeToAllocate * researchRate);
		var taxesAllocated = tradeToAllocate - researchAllocated;
		resourceGroup.resourceAdd(new Resource("Research", researchAllocated));
		resourceGroup.resourceAdd(new Resource("Wealth", researchAllocated));
		return resourceGroup;
	}

	IncomeAllocation.prototype.researchRate = function()
	{
		return this.researchPercentage / 100;
	}

	IncomeAllocation.prototype.taxRate = function()
	{
		return this.taxPercentage / 100;
	}

	IncomeAllocation.prototype.toString = function()
	{
		return this.taxPercentage + "% tax, " + this.researchPercentage + "% research"; 
	}
}