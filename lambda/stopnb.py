import json
import boto3

print('Loading function')

client = boto3.client('sagemaker')

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))

    # See if the SageMaker Notebook is running
    print('Getting list of notebook instances with name containing "fastai" and status is "in-service"')
    response = client.list_notebook_instances(NameContains='fastai', StatusEquals='InService')
    print("Notebook instance list: " + json.dumps(response['NotebookInstances'], indent=2))

    # check if more than one notebook is fastai
    if len(response['NotebookInstances']) > 0:
        print('Stopping notebook instance with name "fastai"')
        # stop the notebook instance
        client.stop_notebook_instance(NotebookInstanceName='fastai')
    else:
        print('fastai notebook instance not running')

    return 'Success'