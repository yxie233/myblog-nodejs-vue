<template>
    <div class="modal-backdrop" @click="close" v-show="show">
        <div class="modal" @click.stop>
            <div class="modal-header">
                <slot name="header">
                    <span style="float:left" >Delete Confirmation</span>
                    <!--button type="button" class="btn-color" @click="close">x</button-->
                </slot>
            </div>
            <div class="modal-body">
                <slot name="body">
                    <span style="color:red"> Delete Article: {{deltinfo.title}}</span> 
                </slot>
            </div>
            <div class="modal-footer">
                <slot name="footer">                    
                    <button type="button" style="float:left" class="btn-color" @click="deletePost(deltinfo.aid)">Delete</button>              
                    <button type="button"  style="float:right" class="btn-color" @click="close">Cancel</button>
                </slot>
            </div>
        </div>
    </div>
</template>
<script>
// import ArticleService from '@/services/ArticleService'

    export default {
        name: 'MyModal',   
        props: ["show", "deltinfo"],
        data () {
            return {
            }
        },
        methods: {
            close: function () {
                this.$emit('close');
            },
            async deletePost (id) {               
                this.$emit('fromModal',  id)
                this.close();
            }
        }
    }
</script>

<style scoped>
    .modal-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0,0,0,.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal {
        background-color: #fff;
        box-shadow: 2px 2px 20px 1px;
        overflow-x:auto;
        display: flex;
        flex-direction: column; 
    }
    .modal-header,
    .modal-footer {
        padding: 15px;       
    }
    .modal-header {
        border-bottom: 1px solid #eee;
        color: #4d7ef7;
        justify-content: space-between;
    }
    .modal-footer {
        border-top: 1px solid #eee;
        justify-content: flex-end;
    }
    .modal-body {
        position: left;
        padding: 15px 15px;
    }
    .btn-close {
        border: none 0;
        font-size: 15px;
        padding: 0px;
        cursor: pointer;
        font-weight: bold;
        float: right;
        color: #4aae9b;
        background-color: transparent;
    }
    .btn-color {
        background: #4d7ef7;
        color: #fff;
        padding: 3px;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: bold;
        border: 1px solid #4d7ef7;
        border-radius: 2px;
        cursor: pointer;
    }
    button:hover {
        background: #fff;
        color: #4d7ef7;
        border: 1px solid #4d7ef7;
    }
</style>