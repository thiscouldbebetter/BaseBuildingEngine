
function ControlLabelDynamic(name, dataBinding)
{
	this.name = name;
	this.dataBinding = dataBinding;
}

{
	ControlLabelDynamic.prototype.text = function()
	{
		return this.dataBinding.get();
	}

	ControlLabelDynamic.prototype.domElementUpdate = function()
	{
		if (this._domElement == null)
		{
			this._domElement = document.createElement("label");
		}

		this._domElement.innerHTML = this.text();

		return this._domElement;

	}
}
